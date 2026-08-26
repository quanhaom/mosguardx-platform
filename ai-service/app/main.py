import logging
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from hashlib import sha256
from hmac import compare_digest
from io import BytesIO
from pathlib import Path
from uuid import uuid4

from fastapi import (
    FastAPI,
    File,
    Form,
    Header,
    HTTPException,
    Query,
    Response,
    Request,
    UploadFile,
    status,
)
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageOps, UnidentifiedImageError

from .backend import BackendStore
from .config import get_settings
from .detector import MosquitoDetector
from .schemas import (
    AlertResponse,
    AlertStatusUpdate,
    DashboardSummary,
    Detection,
    HealthResponse,
    ImageInfo,
    ObservationResponse,
    PredictionResponse,
    StationCreate,
    StationResponse,
)


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("mosguardx")

settings = get_settings()

allowed_content_types = {
    "image/jpeg",
    "image/png",
    "image/webp",
}

content_type_extensions = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}

species_vi_names = {
    "aegypti": "Muỗi vằn Aedes aegypti",
    "aedes_aegypti": "Muỗi vằn Aedes aegypti",
    "albopictus": "Muỗi vằn châu Á",
    "aedes_albopictus": "Muỗi vằn châu Á",
    "culex": "Muỗi Culex",
    "anopheles": "Muỗi Anopheles",
    "culiseta": "Muỗi Culiseta",
    "japonicus_koreicus": "Nhóm Aedes japonicus/koreicus",
    "japonicus-koreicus": "Nhóm Aedes japonicus/koreicus",
}


def hash_secret(value: str) -> str:
    return sha256(value.encode("utf-8")).hexdigest()


def normalize_species_name(species: str) -> str:
    return (
        species.strip()
        .lower()
        .replace(" ", "_")
        .replace("/", "_")
    )


def get_species_vi(species: str) -> str:
    normalized = normalize_species_name(species)

    return species_vi_names.get(
        normalized,
        f"Muỗi thuộc nhóm {species}",
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.detector = None
    app.state.model_error = None

    app.state.store = None
    app.state.backend_error = None

    try:
        if not settings.supabase_configured:
            raise RuntimeError(
                "Supabase chưa được cấu hình"
            )

        store = BackendStore(settings)
        store.ping()

        app.state.store = store

        store.ensure_model(
            settings.resolved_model_path
        )

        logger.info("Supabase backend is ready")
    except Exception as exc:
        app.state.backend_error = str(exc)

        logger.exception(
            "Could not initialize Supabase backend"
        )

    try:
        app.state.detector = MosquitoDetector(
            model_path=settings.resolved_model_path,
            image_size=settings.image_size,
            model_version=settings.model_version,
        )

        logger.info(
            "AI model loaded: %s",
            settings.model_version,
        )
    except Exception as exc:
        app.state.model_error = str(exc)

        logger.exception(
            "Could not initialize AI model"
        )

    yield

    app.state.detector = None
    app.state.store = None


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "Mosquito detection and station ingestion API "
        "for the MosGuardX monitoring platform."
    ),
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PATCH", "OPTIONS"],
    allow_headers=[
        "Content-Type",
        "Authorization",
        "X-Admin-Key",
        "X-Device-Key",
        "X-Idempotency-Key",
    ],
)


def require_store(request: Request) -> BackendStore:
    store = request.app.state.store

    if store is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Storage backend is not ready",
        )

    return store


def require_detector(request: Request) -> MosquitoDetector:
    detector = request.app.state.detector

    if detector is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI model is not ready",
        )

    return detector


def verify_admin_key(
    provided_key: str | None,
) -> None:
    if not settings.admin_api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ADMIN_API_KEY is not configured",
        )

    if not provided_key or not compare_digest(
        provided_key,
        settings.admin_api_key,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin key",
        )


def authenticate_station(
    store: BackendStore,
    station_id: str,
    device_key: str | None,
) -> dict:
    station = store.get_station(station_id)

    if station is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Station not found",
        )

    stored_hash = str(
        station.get("device_key_hash") or ""
    )

    supplied_hash = hash_secret(device_key or "")

    if not compare_digest(
        stored_hash,
        supplied_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid device key",
        )

    return station


async def read_and_validate_image(
    file: UploadFile,
) -> tuple[bytes, Image.Image, str]:
    content_type = (
        file.content_type or ""
    ).lower()

    if content_type not in allowed_content_types:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=(
                "Only JPEG, PNG and WEBP "
                "images are accepted"
            ),
        )

    limit = settings.max_upload_mb * 1024 * 1024
    content = await file.read(limit + 1)

    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image file is empty",
        )

    if len(content) > limit:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=(
                f"Image exceeds the "
                f"{settings.max_upload_mb} MB limit"
            ),
        )

    try:
        verification_image = Image.open(
            BytesIO(content)
        )

        verification_image.verify()

        image = Image.open(
            BytesIO(content)
        )

        image = ImageOps.exif_transpose(
            image
        ).convert("RGB")
    except (
        UnidentifiedImageError,
        OSError,
        ValueError,
    ) as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or corrupted image",
        ) from exc

    return content, image, content_type


def enrich_detection(
    detection: dict,
) -> dict:
    species = str(
        detection.get("species") or "unknown"
    )

    return {
        **detection,
        "species_vi": get_species_vi(species),
    }


def database_detection_to_api(
    row: dict,
) -> dict:
    return {
        "object": row.get(
            "object_type",
            "mosquito",
        ),
        "class_id": int(row["class_id"]),
        "species": str(row["species"]),
        "species_vi": row.get("species_vi"),
        "confidence": float(row["confidence"]),
        "bounding_box": {
            "x1": float(row["x1"]),
            "y1": float(row["y1"]),
            "x2": float(row["x2"]),
            "y2": float(row["y2"]),
        },
        "normalized_bounding_box": {
            "x1": float(row["normalized_x1"]),
            "y1": float(row["normalized_y1"]),
            "x2": float(row["normalized_x2"]),
            "y2": float(row["normalized_y2"]),
        },
    }


def build_observation_response(
    store: BackendStore,
    observation: dict,
) -> ObservationResponse:
    observation_id = str(observation["id"])

    detection_rows = store.get_detections(
        observation_id
    )

    image_path = str(
        observation["image_path"]
    )

    image_url: str | None = None

    try:
        image_url = store.create_image_signed_url(
            image_path
        )
    except Exception:
        logger.exception(
            "Could not create signed image URL"
        )

    return ObservationResponse(
        id=observation_id,
        station_id=str(
            observation["station_id"]
        ),
        idempotency_key=observation.get(
            "idempotency_key"
        ),
        captured_at=observation["captured_at"],
        received_at=observation["received_at"],
        temperature=observation.get(
            "temperature"
        ),
        humidity=observation.get("humidity"),
        firmware_version=observation.get(
            "firmware_version"
        ),
        processing_status=str(
            observation["processing_status"]
        ),
        total_detected=int(
            observation.get("total_detected")
            or 0
        ),
        model_version=observation.get(
            "model_version"
        ),
        inference_ms=observation.get(
            "inference_ms"
        ),
        error_message=observation.get(
            "error_message"
        ),
        image=ImageInfo(
            filename=Path(image_path).name,
            width=int(
                observation["image_width"]
            ),
            height=int(
                observation["image_height"]
            ),
            path=image_path,
            url=image_url,
        ),
        detections=[
            Detection(
                **database_detection_to_api(row)
            )
            for row in detection_rows
        ],
    )


@app.get("/", include_in_schema=False)
def root() -> dict[str, str]:
    return {
        "service": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
        "liveness": "/health/live",
        "readiness": "/health/ready",
    }


@app.head("/", include_in_schema=False)
def root_head() -> Response:
    return Response(status_code=200)

@app.get(
    "/health/live",
    response_model=HealthResponse,
)
def liveness(
    request: Request,
) -> HealthResponse:
    return HealthResponse(
        status="ok",
        service=settings.app_name,
        version=settings.app_version,
        model_loaded=(
            request.app.state.detector is not None
        ),
        backend_connected=(
            request.app.state.store is not None
        ),
    )


@app.get(
    "/health/ready",
    response_model=HealthResponse,
)
def readiness(
    request: Request,
) -> HealthResponse:
    errors: dict[str, str | None] = {}

    if request.app.state.store is None:
        errors["backend"] = (
            request.app.state.backend_error
        )
    else:
        try:
            request.app.state.store.ping()
        except Exception as exc:
            errors["database"] = str(exc)

    if request.app.state.detector is None:
        errors["model"] = (
            request.app.state.model_error
        )

    if errors:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "message": "Service is not ready",
                "errors": errors,
            },
        )

    return HealthResponse(
        status="ready",
        service=settings.app_name,
        version=settings.app_version,
        model_loaded=True,
        backend_connected=True,
    )


@app.post(
    "/v1/predict",
    response_model=PredictionResponse,
)
async def predict(
    request: Request,
    file: UploadFile = File(...),
    confidence: float = Query(
        default=settings.confidence_threshold,
        ge=0.05,
        le=0.95,
    ),
    iou: float = Query(
        default=settings.iou_threshold,
        ge=0.1,
        le=0.9,
    ),
) -> PredictionResponse:
    detector = require_detector(request)

    _, image, _ = await read_and_validate_image(
        file
    )

    raw_detections, inference_ms = (
        detector.predict(
            image,
            confidence,
            iou,
        )
    )

    detections = [
        enrich_detection(detection)
        for detection in raw_detections
    ]

    return PredictionResponse(
        prediction_id=str(uuid4()),
        model_version=detector.model_version,
        image=ImageInfo(
            filename=(
                file.filename or "upload"
            ),
            width=image.width,
            height=image.height,
        ),
        mosquito_count=len(detections),
        detections=detections,
        inference_ms=round(
            inference_ms,
            2,
        ),
    )


@app.post(
    "/v1/stations",
    response_model=StationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_station(
    payload: StationCreate,
    request: Request,
    x_admin_key: str | None = Header(
        default=None,
        alias="X-Admin-Key",
    ),
) -> StationResponse:
    verify_admin_key(x_admin_key)

    store = require_store(request)

    if store.get_station(payload.id):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Station already exists",
        )

    station = store.create_station(
        {
            "id": payload.id,
            "name": payload.name,
            "device_key_hash": hash_secret(
                payload.device_key
            ),
            "latitude": payload.latitude,
            "longitude": payload.longitude,
            "address": payload.address,
            "firmware_version": (
                payload.firmware_version
            ),
            "status": "offline",
        }
    )

    station.pop("device_key_hash", None)

    return StationResponse(**station)


@app.get(
    "/v1/stations",
    response_model=list[StationResponse],
)
def list_stations(
    request: Request,
) -> list[StationResponse]:
    store = require_store(request)

    return [
        StationResponse(**station)
        for station in store.list_stations()
    ]


@app.get(
    "/v1/stations/{station_id}",
    response_model=StationResponse,
)
def get_station(
    station_id: str,
    request: Request,
) -> StationResponse:
    store = require_store(request)
    station = store.get_station(station_id)

    if station is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Station not found",
        )

    station.pop("device_key_hash", None)

    return StationResponse(**station)


@app.post(
    "/v1/stations/{station_id}/observations",
    response_model=ObservationResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_station_observation(
    station_id: str,
    request: Request,
    file: UploadFile = File(...),
    captured_at: datetime | None = Form(
        default=None
    ),
    temperature: float | None = Form(
        default=None,
        ge=-50,
        le=80,
    ),
    humidity: float | None = Form(
        default=None,
        ge=0,
        le=100,
    ),
    firmware_version: str | None = Form(
        default=None,
        max_length=50,
    ),
    confidence: float = Query(
        default=settings.confidence_threshold,
        ge=0.05,
        le=0.95,
    ),
    iou: float = Query(
        default=settings.iou_threshold,
        ge=0.1,
        le=0.9,
    ),
    x_device_key: str | None = Header(
        default=None,
        alias="X-Device-Key",
    ),
    x_idempotency_key: str | None = Header(
        default=None,
        alias="X-Idempotency-Key",
    ),
) -> ObservationResponse:
    store = require_store(request)
    detector = require_detector(request)

    authenticate_station(
        store,
        station_id,
        x_device_key,
    )

    if x_idempotency_key:
        x_idempotency_key = (
            x_idempotency_key.strip()
        )

        if not 8 <= len(x_idempotency_key) <= 128:
            raise HTTPException(
                status_code=400,
                detail=(
                    "X-Idempotency-Key must contain "
                    "between 8 and 128 characters"
                ),
            )

        existing = (
            store.find_observation_by_idempotency(
                station_id,
                x_idempotency_key,
            )
        )

        if existing is not None:
            return build_observation_response(
                store,
                existing,
            )

    content, image, content_type = (
        await read_and_validate_image(file)
    )

    now = datetime.now(timezone.utc)

    capture_time = captured_at or now

    if capture_time.tzinfo is None:
        capture_time = capture_time.replace(
            tzinfo=timezone.utc
        )

    observation_id = str(uuid4())

    extension = content_type_extensions[
        content_type
    ]

    image_path = (
        f"{station_id}/"
        f"{capture_time:%Y/%m/%d}/"
        f"{observation_id}{extension}"
    )

    try:
        store.upload_observation_image(
            path=image_path,
            content=content,
            content_type=content_type,
        )
    except Exception as exc:
        logger.exception(
            "Could not upload observation image"
        )

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Could not store observation image",
        ) from exc

    try:
        observation = store.create_observation(
            {
                "id": observation_id,
                "station_id": station_id,
                "idempotency_key": (
                    x_idempotency_key
                ),
                "captured_at": (
                    capture_time.isoformat()
                ),
                "received_at": now.isoformat(),
                "image_path": image_path,
                "image_content_type": (
                    content_type
                ),
                "image_width": image.width,
                "image_height": image.height,
                "temperature": temperature,
                "humidity": humidity,
                "firmware_version": (
                    firmware_version
                ),
                "processing_status": (
                    "processing"
                ),
                "total_detected": 0,
            }
        )
    except Exception as exc:
        logger.exception(
            "Could not create observation record"
        )

        try:
            store.delete_observation_image(
                image_path
            )
        except Exception:
            logger.exception(
                "Could not remove orphan image"
            )

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=(
                "Could not create observation record"
            ),
        ) from exc

    try:
        raw_detections, inference_ms = (
            detector.predict(
                image,
                confidence,
                iou,
            )
        )

        detections = [
            enrich_detection(detection)
            for detection in raw_detections
        ]

        database_detections = []

        for detection in detections:
            bounding_box = detection[
                "bounding_box"
            ]

            normalized_box = detection[
                "normalized_bounding_box"
            ]

            database_detections.append(
                {
                    "observation_id": (
                        observation_id
                    ),
                    "object_type": detection[
                        "object"
                    ],
                    "class_id": detection[
                        "class_id"
                    ],
                    "species": detection[
                        "species"
                    ],
                    "species_vi": detection[
                        "species_vi"
                    ],
                    "confidence": detection[
                        "confidence"
                    ],
                    "x1": bounding_box["x1"],
                    "y1": bounding_box["y1"],
                    "x2": bounding_box["x2"],
                    "y2": bounding_box["y2"],
                    "normalized_x1": (
                        normalized_box["x1"]
                    ),
                    "normalized_y1": (
                        normalized_box["y1"]
                    ),
                    "normalized_x2": (
                        normalized_box["x2"]
                    ),
                    "normalized_y2": (
                        normalized_box["y2"]
                    ),
                }
            )

        store.create_detections(
            database_detections
        )

        observation = store.update_observation(
            observation_id,
            {
                "processing_status": (
                    "completed"
                ),
                "total_detected": len(
                    detections
                ),
                "model_version": (
                    detector.model_version
                ),
                "inference_ms": round(
                    inference_ms,
                    2,
                ),
                "error_message": None,
            },
        )

        store.update_station_seen(
            station_id=station_id,
            last_seen_at=now.isoformat(),
            firmware_version=(
                firmware_version
            ),
        )

        if (
            len(detections)
            >= settings.alert_count_threshold
        ):
            threshold = (
                settings.alert_count_threshold
            )

            if len(detections) >= threshold * 3:
                alert_level = "critical"
            elif len(detections) >= threshold * 2:
                alert_level = "high"
            else:
                alert_level = "medium"

            try:
                store.create_alert(
                    {
                        "station_id": (
                            station_id
                        ),
                        "observation_id": (
                            observation_id
                        ),
                        "level": alert_level,
                        "title": (
                            "Mật độ muỗi vượt ngưỡng"
                        ),
                        "message": (
                            f"Trạm {station_id} ghi "
                            f"nhận {len(detections)} "
                            "cá thể trong một lần chụp."
                        ),
                        "status": "new",
                    }
                )
            except Exception:
                logger.exception(
                    "Could not create alert"
                )

    except HTTPException:
        raise
    except Exception as exc:
        logger.exception(
            "Observation inference failed"
        )

        try:
            store.update_observation(
                observation_id,
                {
                    "processing_status": (
                        "failed"
                    ),
                    "error_message": (
                        str(exc)[:1000]
                    ),
                },
            )
        except Exception:
            logger.exception(
                "Could not mark observation failed"
            )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Observation inference failed",
        ) from exc

    return build_observation_response(
        store,
        observation,
    )


@app.get(
    "/v1/observations",
    response_model=list[ObservationResponse],
)
def list_observations(
    request: Request,
    station_id: str | None = Query(
        default=None
    ),
    limit: int = Query(
        default=20,
        ge=1,
        le=100,
    ),
) -> list[ObservationResponse]:
    store = require_store(request)

    observations = store.list_observations(
        limit=limit,
        station_id=station_id,
    )

    return [
        build_observation_response(
            store,
            observation,
        )
        for observation in observations
    ]


@app.get(
    "/v1/observations/{observation_id}",
    response_model=ObservationResponse,
)
def get_observation(
    observation_id: str,
    request: Request,
) -> ObservationResponse:
    store = require_store(request)

    observation = store.get_observation(
        observation_id
    )

    if observation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Observation not found",
        )

    return build_observation_response(
        store,
        observation,
    )


@app.get(
    "/v1/dashboard/summary",
    response_model=DashboardSummary,
)
def dashboard_summary(
    request: Request,
) -> DashboardSummary:
    store = require_store(request)

    return DashboardSummary(
        **store.dashboard_summary()
    )


@app.get(
    "/v1/alerts",
    response_model=list[AlertResponse],
)
def list_alerts(
    request: Request,
    status_filter: str | None = Query(
        default=None,
        alias="status",
    ),
    limit: int = Query(
        default=20,
        ge=1,
        le=100,
    ),
) -> list[AlertResponse]:
    store = require_store(request)

    if status_filter not in {
        None,
        "new",
        "acknowledged",
        "resolved",
    }:
        raise HTTPException(
            status_code=400,
            detail="Invalid alert status",
        )

    return [
        AlertResponse(**alert)
        for alert in store.list_alerts(
            limit=limit,
            status=status_filter,
        )
    ]


@app.patch(
    "/v1/alerts/{alert_id}",
    response_model=AlertResponse,
)
def update_alert(
    alert_id: str,
    payload: AlertStatusUpdate,
    request: Request,
    x_admin_key: str | None = Header(
        default=None,
        alias="X-Admin-Key",
    ),
) -> AlertResponse:
    verify_admin_key(x_admin_key)

    store = require_store(request)
    now = datetime.now(timezone.utc)

    update_payload: dict = {
        "status": payload.status,
    }

    if payload.status == "acknowledged":
        update_payload[
            "acknowledged_at"
        ] = now.isoformat()

    if payload.status == "resolved":
        update_payload[
            "resolved_at"
        ] = now.isoformat()

    alert = store.update_alert(
        alert_id,
        update_payload,
    )

    if alert is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found",
        )

    return AlertResponse(**alert)