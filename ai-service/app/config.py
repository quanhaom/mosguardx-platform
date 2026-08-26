from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


SERVICE_ROOT = Path(__file__).resolve().parents[1]
ENV_FILE = SERVICE_ROOT / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "MosGuardX AI API"
    app_version: str = "1.1.0-beta"
    app_environment: str = "development"

    model_path: Path = Path("models/mosguardx_best.pt")
    model_version: str = "mosguardx-yolo11n-v1"
    model_storage_bucket: str = "mosguardx-models"
    model_storage_path: str = "mosguardx_best.pt"

    confidence_threshold: float = 0.35
    iou_threshold: float = 0.45
    image_size: int = 640
    max_upload_mb: int = 10

    cors_origins: str = (
        "http://localhost:3000,"
        "https://mosguardx-platform.vercel.app"
    )

    supabase_url: str = ""
    supabase_service_role_key: str = ""
    observation_bucket: str = "mosguardx-observations"

    admin_api_key: str = ""
    signed_url_ttl_seconds: int = 3600
    alert_count_threshold: int = 10

    @property
    def allowed_origins(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.cors_origins.split(",")
            if origin.strip()
        ]

    @property
    def resolved_model_path(self) -> Path:
        if self.model_path.is_absolute():
            return self.model_path

        return SERVICE_ROOT / self.model_path

    @property
    def supabase_configured(self) -> bool:
        return bool(
            self.supabase_url.strip()
            and self.supabase_service_role_key.strip()
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()