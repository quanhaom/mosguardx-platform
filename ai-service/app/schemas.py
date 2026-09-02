from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class BoundingBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float


class NormalizedBoundingBox(BaseModel):
    x1: float = Field(ge=0, le=1)
    y1: float = Field(ge=0, le=1)
    x2: float = Field(ge=0, le=1)
    y2: float = Field(ge=0, le=1)


class Detection(BaseModel):
    object: str = "mosquito"
    class_id: int = Field(ge=0)
    species: str
    species_vi: str | None = None
    confidence: float = Field(ge=0, le=1)
    detector_confidence: float | None = Field(
        default=None,
        ge=0,
        le=1,
    )
    classification_confidence: float | None = Field(
        default=None,
        ge=0,
        le=1,
    )
    classification_model_version: str | None = None
    review_required: bool = False
    bounding_box: BoundingBox
    normalized_bounding_box: NormalizedBoundingBox


class ImageInfo(BaseModel):
    filename: str
    width: int
    height: int
    path: str | None = None
    url: str | None = None


class PredictionResponse(BaseModel):
    prediction_id: str
    model_version: str
    image: ImageInfo
    mosquito_count: int
    detections: list[Detection]
    inference_ms: float


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    model_loaded: bool
    backend_connected: bool = False
    classifier_loaded: bool = False
    classifier_model_version: str | None = None


class StationCreate(BaseModel):
    id: str = Field(
        min_length=3,
        max_length=64,
        pattern=r"^[A-Z0-9][A-Z0-9_-]+$",
    )

    name: str = Field(min_length=2, max_length=120)
    device_key: str = Field(min_length=16, max_length=256)

    latitude: float | None = Field(
        default=None,
        ge=-90,
        le=90,
    )

    longitude: float | None = Field(
        default=None,
        ge=-180,
        le=180,
    )

    address: str | None = Field(
        default=None,
        max_length=300,
    )

    firmware_version: str | None = Field(
        default=None,
        max_length=50,
    )


class StationResponse(BaseModel):
    id: str
    name: str
    latitude: float | None = None
    longitude: float | None = None
    address: str | None = None
    status: str
    firmware_version: str | None = None
    last_seen_at: datetime | None = None
    created_at: datetime
    updated_at: datetime


class ObservationResponse(BaseModel):
    id: str
    station_id: str
    idempotency_key: str | None = None

    captured_at: datetime
    received_at: datetime

    temperature: float | None = None
    humidity: float | None = None
    firmware_version: str | None = None

    processing_status: str
    total_detected: int

    model_version: str | None = None
    inference_ms: float | None = None
    error_message: str | None = None

    image: ImageInfo
    detections: list[Detection]


class DashboardSummary(BaseModel):
    station_count: int
    online_station_count: int
    observation_count: int
    mosquito_count: int
    new_alert_count: int


class AlertResponse(BaseModel):
    id: str
    station_id: str
    observation_id: str | None = None

    level: Literal["low", "medium", "high", "critical"]
    title: str
    message: str

    status: Literal["new", "acknowledged", "resolved"]

    created_at: datetime
    acknowledged_at: datetime | None = None
    resolved_at: datetime | None = None


class AlertStatusUpdate(BaseModel):
    status: Literal["acknowledged", "resolved"]
