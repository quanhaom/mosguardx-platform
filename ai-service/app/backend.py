from pathlib import Path
from typing import Any

from supabase import (
    Client,
    create_client,
)

from .config import Settings


class BackendStore:
    def __init__(
        self,
        settings: Settings,
    ) -> None:
        if not settings.supabase_configured:
            raise RuntimeError(
                "SUPABASE_URL hoặc "
                "SUPABASE_SERVICE_ROLE_KEY "
                "chưa được cấu hình"
            )

        self.settings = settings

        self.client: Client = (
            create_client(
                settings.supabase_url,
                settings.supabase_service_role_key,
            )
        )

    # =====================================================
    # INTERNAL HELPERS
    # =====================================================

    @staticmethod
    def _first(
        data: Any,
    ) -> dict[str, Any] | None:
        if (
            not isinstance(
                data,
                list,
            )
            or not data
        ):
            return None

        first = data[0]

        if not isinstance(
            first,
            dict,
        ):
            return None

        return first

    # =====================================================
    # HEALTH
    # =====================================================

    def ping(
        self,
    ) -> bool:
        response = (
            self.client
            .table("stations")
            .select("id")
            .limit(1)
            .execute()
        )

        return (
            response.data
            is not None
        )

    # =====================================================
    # MODEL STORAGE
    # =====================================================

    def ensure_model(
        self,
        local_path: Path,
        storage_bucket: str | None = None,
        storage_path: str | None = None,
    ) -> Path:
        if (
            local_path.is_file()
            and local_path.stat().st_size > 0
        ):
            return local_path

        local_path.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        bucket = (
            storage_bucket
            or self.settings.model_storage_bucket
        )

        remote_path = (
            storage_path
            or self.settings.model_storage_path
        )

        model_bytes = (
            self.client.storage
            .from_(bucket)
            .download(
                remote_path
            )
        )

        if not model_bytes:
            raise RuntimeError(
                "Không tải được model "
                f"{bucket}/{remote_path} "
                "từ Supabase Storage"
            )

        temporary_path = (
            local_path.with_suffix(
                local_path.suffix
                + ".download"
            )
        )

        temporary_path.write_bytes(
            bytes(model_bytes)
        )

        temporary_path.replace(
            local_path
        )

        return local_path

    # =====================================================
    # IMAGE STORAGE
    # =====================================================

    def upload_observation_image(
        self,
        path: str,
        content: bytes,
        content_type: str,
    ) -> str:
        (
            self.client.storage
            .from_(
                self.settings
                .observation_bucket
            )
            .upload(
                path=path,
                file=content,
                file_options={
                    "content-type":
                        content_type,

                    "cache-control":
                        "3600",

                    "upsert":
                        "false",
                },
            )
        )

        return path

    def delete_observation_image(
        self,
        path: str,
    ) -> None:
        (
            self.client.storage
            .from_(
                self.settings
                .observation_bucket
            )
            .remove(
                [path]
            )
        )

    def create_image_signed_url(
        self,
        path: str,
    ) -> str | None:
        result = (
            self.client.storage
            .from_(
                self.settings
                .observation_bucket
            )
            .create_signed_url(
                path,
                self.settings
                .signed_url_ttl_seconds,
            )
        )

        if not isinstance(
            result,
            dict,
        ):
            return None

        signed_url = (
            result.get(
                "signedURL"
            )
            or result.get(
                "signedUrl"
            )
            or result.get(
                "signed_url"
            )
        )

        if not signed_url:
            return None

        signed_url = str(
            signed_url
        )

        if signed_url.startswith(
            "http"
        ):
            return signed_url

        if signed_url.startswith(
            "/storage/v1"
        ):
            return (
                self.settings
                .supabase_url
                .rstrip("/")
                + signed_url
            )

        return (
            self.settings
            .supabase_url
            .rstrip("/")
            + "/storage/v1"
            + (
                signed_url
                if signed_url.startswith(
                    "/"
                )
                else f"/{signed_url}"
            )
        )

    # =====================================================
    # ACCOUNTS
    # =====================================================

    def create_account(
        self,
        payload: dict[str, Any],
    ) -> dict[str, Any]:
        response = (
            self.client
            .table("accounts")
            .insert(payload)
            .execute()
        )

        account = self._first(
            response.data
        )

        if account is None:
            raise RuntimeError(
                "Không tạo được account"
            )

        return account

    def get_account(
        self,
        account_id: str,
    ) -> dict[str, Any] | None:
        response = (
            self.client
            .table("accounts")
            .select("*")
            .eq(
                "id",
                account_id,
            )
            .limit(1)
            .execute()
        )

        return self._first(
            response.data
        )

    def get_account_by_slug(
        self,
        slug: str,
    ) -> dict[str, Any] | None:
        response = (
            self.client
            .table("accounts")
            .select("*")
            .eq(
                "slug",
                slug,
            )
            .limit(1)
            .execute()
        )

        return self._first(
            response.data
        )

    def list_accounts(
        self,
        account_type: (
            str | None
        ) = None,
        status: (
            str | None
        ) = None,
    ) -> list[dict[str, Any]]:
        query = (
            self.client
            .table("accounts")
            .select("*")
        )

        if account_type:
            query = query.eq(
                "type",
                account_type,
            )

        if status:
            query = query.eq(
                "status",
                status,
            )

        response = (
            query
            .order(
                "created_at",
                desc=False,
            )
            .execute()
        )

        return list(
            response.data
            or []
        )

    # =====================================================
    # SITES
    # =====================================================

    def create_site(
        self,
        payload: dict[str, Any],
    ) -> dict[str, Any]:
        response = (
            self.client
            .table("sites")
            .insert(payload)
            .execute()
        )

        site = self._first(
            response.data
        )

        if site is None:
            raise RuntimeError(
                "Không tạo được site"
            )

        return site

    def get_site(
        self,
        site_id: str,
    ) -> dict[str, Any] | None:
        response = (
            self.client
            .table("sites")
            .select("*")
            .eq(
                "id",
                site_id,
            )
            .limit(1)
            .execute()
        )

        return self._first(
            response.data
        )

    def find_site_by_code(
        self,
        account_id: str,
        code: str,
    ) -> dict[str, Any] | None:
        response = (
            self.client
            .table("sites")
            .select("*")
            .eq(
                "account_id",
                account_id,
            )
            .eq(
                "code",
                code,
            )
            .limit(1)
            .execute()
        )

        return self._first(
            response.data
        )

    def list_sites(
        self,
        account_id: (
            str | None
        ) = None,
        status: (
            str | None
        ) = None,
    ) -> list[dict[str, Any]]:
        query = (
            self.client
            .table("sites")
            .select("*")
        )

        if account_id:
            query = query.eq(
                "account_id",
                account_id,
            )

        if status:
            query = query.eq(
                "status",
                status,
            )

        response = (
            query
            .order(
                "created_at",
                desc=False,
            )
            .execute()
        )

        return list(
            response.data
            or []
        )

    # =====================================================
    # STATIONS
    # =====================================================

    def create_station(
        self,
        payload: dict[str, Any],
    ) -> dict[str, Any]:
        response = (
            self.client
            .table("stations")
            .insert(payload)
            .execute()
        )

        station = self._first(
            response.data
        )

        if station is None:
            raise RuntimeError(
                "Không tạo được trạm"
            )

        return station

    def get_station(
        self,
        station_id: str,
    ) -> dict[str, Any] | None:
        response = (
            self.client
            .table("stations")
            .select("*")
            .eq(
                "id",
                station_id,
            )
            .limit(1)
            .execute()
        )

        return self._first(
            response.data
        )

    def list_stations(
        self,
    ) -> list[dict[str, Any]]:
        response = (
            self.client
            .table("stations")
            .select(
                "id,"
                "name,"
                "site_id,"
                "latitude,"
                "longitude,"
                "address,"
                "status,"
                "serial_number,"
                "hardware_version,"
                "firmware_version,"
                "installed_at,"
                "last_seen_at,"
                "metadata,"
                "created_at,"
                "updated_at"
            )
            .order(
                "created_at",
                desc=False,
            )
            .execute()
        )

        return list(
            response.data
            or []
        )

    def list_stations_for_site(
        self,
        site_id: str,
    ) -> list[dict[str, Any]]:
        response = (
            self.client
            .table("stations")
            .select(
                "id,"
                "name,"
                "site_id,"
                "latitude,"
                "longitude,"
                "address,"
                "status,"
                "serial_number,"
                "hardware_version,"
                "firmware_version,"
                "installed_at,"
                "last_seen_at,"
                "metadata,"
                "created_at,"
                "updated_at"
            )
            .eq(
                "site_id",
                site_id,
            )
            .order(
                "created_at",
                desc=False,
            )
            .execute()
        )

        return list(
            response.data
            or []
        )

    def assign_station_to_site(
        self,
        station_id: str,
        site_id: str | None,
    ) -> dict[str, Any] | None:
        response = (
            self.client
            .table("stations")
            .update(
                {
                    "site_id":
                        site_id,
                }
            )
            .eq(
                "id",
                station_id,
            )
            .execute()
        )

        return self._first(
            response.data
        )

    def update_station_seen(
        self,
        station_id: str,
        last_seen_at: str,
        firmware_version: (
            str | None
        ),
    ) -> None:
        payload: dict[
            str,
            Any,
        ] = {
            "status":
                "online",

            "last_seen_at":
                last_seen_at,
        }

        if firmware_version:
            payload[
                "firmware_version"
            ] = firmware_version

        (
            self.client
            .table("stations")
            .update(payload)
            .eq(
                "id",
                station_id,
            )
            .execute()
        )

    # =====================================================
    # OBSERVATIONS
    # =====================================================

    def create_observation(
        self,
        payload: dict[str, Any],
    ) -> dict[str, Any]:
        response = (
            self.client
            .table("observations")
            .insert(payload)
            .execute()
        )

        observation = (
            self._first(
                response.data
            )
        )

        if observation is None:
            raise RuntimeError(
                "Không tạo được "
                "observation"
            )

        return observation

    def update_observation(
        self,
        observation_id: str,
        payload: dict[str, Any],
    ) -> dict[str, Any]:
        response = (
            self.client
            .table("observations")
            .update(payload)
            .eq(
                "id",
                observation_id,
            )
            .execute()
        )

        observation = (
            self._first(
                response.data
            )
        )

        if observation is None:
            raise RuntimeError(
                "Không cập nhật được "
                "observation"
            )

        return observation

    def get_observation(
        self,
        observation_id: str,
    ) -> dict[str, Any] | None:
        response = (
            self.client
            .table("observations")
            .select("*")
            .eq(
                "id",
                observation_id,
            )
            .limit(1)
            .execute()
        )

        return self._first(
            response.data
        )

    def find_observation_by_idempotency(
        self,
        station_id: str,
        idempotency_key: str,
    ) -> dict[str, Any] | None:
        response = (
            self.client
            .table("observations")
            .select("*")
            .eq(
                "station_id",
                station_id,
            )
            .eq(
                "idempotency_key",
                idempotency_key,
            )
            .limit(1)
            .execute()
        )

        return self._first(
            response.data
        )

    def list_observations(
        self,
        limit: int,
        station_id: (
            str | None
        ) = None,
    ) -> list[dict[str, Any]]:
        query = (
            self.client
            .table("observations")
            .select("*")
        )

        if station_id:
            query = query.eq(
                "station_id",
                station_id,
            )

        response = (
            query
            .order(
                "received_at",
                desc=True,
            )
            .limit(limit)
            .execute()
        )

        return list(
            response.data
            or []
        )

    # =====================================================
    # DETECTIONS
    # =====================================================

    def create_detections(
        self,
        payloads: list[
            dict[str, Any]
        ],
    ) -> list[dict[str, Any]]:
        if not payloads:
            return []

        response = (
            self.client
            .table("detections")
            .insert(payloads)
            .execute()
        )

        return list(
            response.data
            or []
        )

    def get_detections(
        self,
        observation_id: str,
    ) -> list[dict[str, Any]]:
        response = (
            self.client
            .table("detections")
            .select("*")
            .eq(
                "observation_id",
                observation_id,
            )
            .order(
                "confidence",
                desc=True,
            )
            .execute()
        )

        return list(
            response.data
            or []
        )

    # =====================================================
    # ALERTS
    # =====================================================

    def create_alert(
        self,
        payload: dict[str, Any],
    ) -> dict[str, Any]:
        response = (
            self.client
            .table("alerts")
            .insert(payload)
            .execute()
        )

        alert = self._first(
            response.data
        )

        if alert is None:
            raise RuntimeError(
                "Không tạo được "
                "cảnh báo"
            )

        return alert

    def get_alert(
        self,
        alert_id: str,
    ) -> dict[str, Any] | None:
        response = (
            self.client
            .table("alerts")
            .select("*")
            .eq(
                "id",
                alert_id,
            )
            .limit(1)
            .execute()
        )

        return self._first(
            response.data
        )

    def list_alerts(
        self,
        limit: int,
        status: (
            str | None
        ) = None,
    ) -> list[dict[str, Any]]:
        query = (
            self.client
            .table("alerts")
            .select("*")
        )

        if status:
            query = query.eq(
                "status",
                status,
            )

        response = (
            query
            .order(
                "created_at",
                desc=True,
            )
            .limit(limit)
            .execute()
        )

        return list(
            response.data
            or []
        )

    def update_alert(
        self,
        alert_id: str,
        payload: dict[str, Any],
    ) -> dict[str, Any] | None:
        response = (
            self.client
            .table("alerts")
            .update(payload)
            .eq(
                "id",
                alert_id,
            )
            .execute()
        )

        return self._first(
            response.data
        )

    # =====================================================
    # MAINTENANCE
    # =====================================================

    def create_maintenance_job(
        self,
        payload: dict[str, Any],
    ) -> dict[str, Any]:
        response = (
            self.client
            .table(
                "maintenance_jobs"
            )
            .insert(payload)
            .execute()
        )

        job = self._first(
            response.data
        )

        if job is None:
            raise RuntimeError(
                "Không tạo được "
                "maintenance job"
            )

        return job

    def get_maintenance_job(
        self,
        job_id: str,
    ) -> dict[str, Any] | None:
        response = (
            self.client
            .table(
                "maintenance_jobs"
            )
            .select("*")
            .eq(
                "id",
                job_id,
            )
            .limit(1)
            .execute()
        )

        return self._first(
            response.data
        )

    def list_maintenance_jobs(
        self,
        account_id: (
            str | None
        ) = None,
        site_id: (
            str | None
        ) = None,
        station_id: (
            str | None
        ) = None,
        status: (
            str | None
        ) = None,
        limit: int = 100,
    ) -> list[dict[str, Any]]:
        query = (
            self.client
            .table(
                "maintenance_jobs"
            )
            .select("*")
        )

        if account_id:
            query = query.eq(
                "account_id",
                account_id,
            )

        if site_id:
            query = query.eq(
                "site_id",
                site_id,
            )

        if station_id:
            query = query.eq(
                "station_id",
                station_id,
            )

        if status:
            query = query.eq(
                "status",
                status,
            )

        response = (
            query
            .order(
                "created_at",
                desc=True,
            )
            .limit(limit)
            .execute()
        )

        return list(
            response.data
            or []
        )

    def update_maintenance_job(
        self,
        job_id: str,
        payload: dict[str, Any],
    ) -> dict[str, Any] | None:
        response = (
            self.client
            .table(
                "maintenance_jobs"
            )
            .update(payload)
            .eq(
                "id",
                job_id,
            )
            .execute()
        )

        return self._first(
            response.data
        )

    # =====================================================
    # DASHBOARD
    # =====================================================

    def dashboard_summary(
        self,
    ) -> dict[str, int]:
        station_response = (
            self.client
            .table("stations")
            .select(
                "id,status",
                count="exact",
            )
            .execute()
        )

        observation_response = (
            self.client
            .table("observations")
            .select(
                (
                    "id,"
                    "total_detected,"
                    "processing_status"
                ),
                count="exact",
            )
            .execute()
        )

        alert_response = (
            self.client
            .table("alerts")
            .select(
                "id,status",
                count="exact",
            )
            .eq(
                "status",
                "new",
            )
            .execute()
        )

        stations = list(
            station_response.data
            or []
        )

        observations = list(
            observation_response.data
            or []
        )

        return {
            "station_count":
                int(
                    station_response.count
                    if (
                        station_response.count
                        is not None
                    )
                    else len(stations)
                ),

            "online_station_count":
                sum(
                    1
                    for station
                    in stations
                    if station.get(
                        "status"
                    )
                    == "online"
                ),

            "observation_count":
                int(
                    observation_response.count
                    if (
                        observation_response.count
                        is not None
                    )
                    else len(
                        observations
                    )
                ),

            "mosquito_count":
                sum(
                    int(
                        observation.get(
                            "total_detected"
                        )
                        or 0
                    )
                    for observation
                    in observations
                    if observation.get(
                        "processing_status"
                    )
                    == "completed"
                ),

            "new_alert_count":
                int(
                    alert_response.count
                    if (
                        alert_response.count
                        is not None
                    )
                    else len(
                        alert_response.data
                        or []
                    )
                ),
        }