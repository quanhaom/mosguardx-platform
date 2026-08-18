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
    confidence: float = Field(ge=0, le=1)
    bounding_box: BoundingBox
    normalized_bounding_box: NormalizedBoundingBox

class ImageInfo(BaseModel):
    filename: str
    width: int
    height: int


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
