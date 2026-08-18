from contextlib import asynccontextmanager
from io import BytesIO
from uuid import uuid4

from fastapi import FastAPI, File, HTTPException, Query, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError

from .config import get_settings
from .detector import MosquitoDetector
from .schemas import HealthResponse, ImageInfo, PredictionResponse

settings = get_settings()
allowed_content_types = {"image/jpeg", "image/png", "image/webp"}


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.detector = None
    app.state.model_error = None

    try:
        app.state.detector = MosquitoDetector(
            model_path=settings.model_path,
            image_size=settings.image_size,
            model_version=settings.model_path.stem,
        )
    except Exception as exc:
        app.state.model_error = str(exc)

    yield
    app.state.detector = None


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Mosquito detection API for the MosGuardX monitoring platform.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)


@app.get("/", include_in_schema=False)
def root() -> dict[str, str]:
    return {"service": settings.app_name, "docs": "/docs"}


@app.get("/health/live", response_model=HealthResponse)
def liveness(request: Request) -> HealthResponse:
    return HealthResponse(
        status="ok",
        service=settings.app_name,
        version=settings.app_version,
        model_loaded=request.app.state.detector is not None,
    )


@app.get("/health/ready", response_model=HealthResponse)
def readiness(request: Request) -> HealthResponse:
    if request.app.state.detector is None:
        raise HTTPException(
            status_code=503,
            detail={
                "message": "Model is not ready",
                "error": request.app.state.model_error,
            },
        )

    return HealthResponse(
        status="ready",
        service=settings.app_name,
        version=settings.app_version,
        model_loaded=True,
    )


@app.post("/v1/predict", response_model=PredictionResponse)
async def predict(
    request: Request,
    file: UploadFile = File(...),
    confidence: float = Query(default=settings.confidence_threshold, ge=0.05, le=0.95),
    iou: float = Query(default=settings.iou_threshold, ge=0.1, le=0.9),
) -> PredictionResponse:
    detector = request.app.state.detector
    if detector is None:
        raise HTTPException(status_code=503, detail="Model is not ready")

    if file.content_type not in allowed_content_types:
        raise HTTPException(status_code=415, detail="Only JPEG, PNG and WEBP images are accepted")

    limit = settings.max_upload_mb * 1024 * 1024
    content = await file.read(limit + 1)
    if len(content) > limit:
        raise HTTPException(
            status_code=413,
            detail=f"Image exceeds the {settings.max_upload_mb} MB limit",
        )

    try:
        image = Image.open(BytesIO(content))
        image.verify()
        image = Image.open(BytesIO(content)).convert("RGB")
    except (UnidentifiedImageError, OSError, ValueError) as exc:
        raise HTTPException(status_code=400, detail="Invalid or corrupted image") from exc

    detections, inference_ms = detector.predict(image, confidence, iou)

    return PredictionResponse(
        prediction_id=str(uuid4()),
        model_version=detector.model_version,
        image=ImageInfo(filename=file.filename or "upload", width=image.width, height=image.height),
        mosquito_count=len(detections),
        detections=detections,
        inference_ms=round(inference_ms, 2),
    )
