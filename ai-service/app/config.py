from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "MosGuardX AI API"
    app_version: str = "1.0.0-beta"
    model_path: Path = Path("models/mosguardx_best.pt")
    confidence_threshold: float = 0.35
    iou_threshold: float = 0.45
    image_size: int = 640
    max_upload_mb: int = 10
    cors_origins: str = "http://localhost:3000"

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
