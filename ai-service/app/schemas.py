from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field


# =========================================================
# AI / DETECTION
# =========================================================


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


# =========================================================
# HEALTH
# =========================================================


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str

    model_loaded: bool
    backend_connected: bool = False

    classifier_loaded: bool = False
    classifier_model_version: str | None = None


# =========================================================
# ACCOUNT
# =========================================================


AccountType = Literal[
    "household",
    "organization",
    "authority",
]

AccountStatus = Literal[
    "active",
    "inactive",
    "suspended",
]


class AccountCreate(BaseModel):
    type: AccountType

    name: str = Field(
        min_length=2,
        max_length=160,
    )

    slug: str = Field(
        min_length=2,
        max_length=120,
        pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$",
    )

    status: AccountStatus = "active"

    metadata: dict[str, Any] = Field(
        default_factory=dict,
    )


class AccountResponse(BaseModel):
    id: str

    type: AccountType
    name: str
    slug: str

    status: AccountStatus

    metadata: dict[str, Any] = Field(
        default_factory=dict,
    )

    created_at: datetime
    updated_at: datetime


# =========================================================
# SITE
# =========================================================


SiteStatus = Literal[
    "active",
    "inactive",
]


class SiteCreate(BaseModel):
    account_id: str

    code: str = Field(
        min_length=1,
        max_length=64,
        pattern=r"^[A-Za-z0-9][A-Za-z0-9_-]*$",
    )

    name: str = Field(
        min_length=2,
        max_length=160,
    )

    site_type: str | None = Field(
        default=None,
        max_length=80,
    )

    address: str | None = Field(
        default=None,
        max_length=300,
    )

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

    timezone: str = Field(
        default="Asia/Ho_Chi_Minh",
        max_length=100,
    )

    status: SiteStatus = "active"

    metadata: dict[str, Any] = Field(
        default_factory=dict,
    )


class SiteResponse(BaseModel):
    id: str
    account_id: str

    code: str
    name: str

    site_type: str | None = None
    address: str | None = None

    latitude: float | None = None
    longitude: float | None = None

    timezone: str

    status: SiteStatus

    metadata: dict[str, Any] = Field(
        default_factory=dict,
    )

    created_at: datetime
    updated_at: datetime


# =========================================================
# STATION
# =========================================================


class StationCreate(BaseModel):
    id: str = Field(
        min_length=3,
        max_length=64,
        pattern=r"^[A-Z0-9][A-Z0-9_-]+$",
    )

    name: str = Field(
        min_length=2,
        max_length=120,
    )

    device_key: str = Field(
        min_length=16,
        max_length=256,
    )

    site_id: str | None = None

    serial_number: str | None = Field(
        default=None,
        max_length=120,
    )

    hardware_version: str | None = Field(
        default=None,
        max_length=80,
    )

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

    installed_at: datetime | None = None

    metadata: dict[str, Any] = Field(
        default_factory=dict,
    )


class StationResponse(BaseModel):
    id: str
    name: str

    site_id: str | None = None

    serial_number: str | None = None
    hardware_version: str | None = None

    latitude: float | None = None
    longitude: float | None = None

    address: str | None = None

    status: str

    firmware_version: str | None = None

    installed_at: datetime | None = None
    last_seen_at: datetime | None = None

    metadata: dict[str, Any] = Field(
        default_factory=dict,
    )

    created_at: datetime
    updated_at: datetime


# =========================================================
# OBSERVATION
# =========================================================


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


# =========================================================
# DASHBOARD
# =========================================================


class DashboardSummary(BaseModel):
    station_count: int
    online_station_count: int

    observation_count: int
    mosquito_count: int

    new_alert_count: int


# =========================================================
# ALERTS
# =========================================================


AlertLevel = Literal[
    "low",
    "medium",
    "high",
    "critical",
]

AlertStatus = Literal[
    "new",
    "acknowledged",
    "resolved",
]


class AlertResponse(BaseModel):
    id: str

    station_id: str
    observation_id: str | None = None

    level: AlertLevel

    title: str
    message: str

    status: AlertStatus

    created_at: datetime

    acknowledged_at: datetime | None = None
    resolved_at: datetime | None = None


class AlertStatusUpdate(BaseModel):
    status: Literal[
        "acknowledged",
        "resolved",
    ]


# =========================================================
# MAINTENANCE
# =========================================================


MaintenanceJobType = Literal[
    "inspection",
    "repair",
    "replacement",
    "cleaning",
    "connectivity",
    "routine",
    "other",
]

MaintenancePriority = Literal[
    "low",
    "medium",
    "high",
    "critical",
]

MaintenanceStatus = Literal[
    "scheduled",
    "in_progress",
    "completed",
    "cancelled",
]


class MaintenanceJobCreate(BaseModel):
    account_id: str

    site_id: str | None = None
    station_id: str | None = None

    source_alert_id: str | None = None

    title: str = Field(
        min_length=2,
        max_length=200,
    )

    description: str | None = Field(
        default=None,
        max_length=2000,
    )

    job_type: MaintenanceJobType = "inspection"

    priority: MaintenancePriority = "medium"

    status: MaintenanceStatus = "scheduled"

    assigned_to: str | None = None

    scheduled_at: datetime | None = None

    notes: str | None = Field(
        default=None,
        max_length=3000,
    )


class MaintenanceJobResponse(BaseModel):
    id: str

    account_id: str

    site_id: str | None = None
    station_id: str | None = None

    source_alert_id: str | None = None

    title: str
    description: str | None = None

    job_type: MaintenanceJobType

    priority: MaintenancePriority
    status: MaintenanceStatus

    assigned_to: str | None = None

    scheduled_at: datetime | None = None
    started_at: datetime | None = None
    completed_at: datetime | None = None

    notes: str | None = None

    created_at: datetime
    updated_at: datetime


class MaintenanceStatusUpdate(BaseModel):
    status: MaintenanceStatus

    assigned_to: str | None = None

    scheduled_at: datetime | None = None

    notes: str | None = Field(
        default=None,
        max_length=3000,
    )