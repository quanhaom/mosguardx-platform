from datetime import (
    datetime,
    timezone,
)

from fastapi import (
    APIRouter,
    Header,
    HTTPException,
    Query,
    Request,
    status,
)

from ..schemas import (
    MaintenanceJobCreate,
    MaintenanceJobResponse,
    MaintenanceStatusUpdate,
)

from .deps import (
    require_store,
    verify_admin_key,
)


router = APIRouter(
    prefix="/v1/maintenance",
    tags=["maintenance"],
)


VALID_STATUSES = {
    "scheduled",
    "in_progress",
    "completed",
    "cancelled",
}


@router.get(
    "",
    response_model=list[
        MaintenanceJobResponse
    ],
)
def list_maintenance_jobs(
    request: Request,
    account_id: str | None = Query(
        default=None
    ),
    site_id: str | None = Query(
        default=None
    ),
    station_id: str | None = Query(
        default=None
    ),
    status_filter: str | None = Query(
        default=None,
        alias="status",
    ),
    limit: int = Query(
        default=50,
        ge=1,
        le=200,
    ),
) -> list[MaintenanceJobResponse]:
    if (
        status_filter is not None
        and status_filter
        not in VALID_STATUSES
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid maintenance status"
            ),
        )

    store = require_store(
        request
    )

    jobs = (
        store.list_maintenance_jobs(
            account_id=account_id,
            site_id=site_id,
            station_id=station_id,
            status=status_filter,
            limit=limit,
        )
    )

    return [
        MaintenanceJobResponse(
            **job
        )
        for job in jobs
    ]


@router.get(
    "/{job_id}",
    response_model=(
        MaintenanceJobResponse
    ),
)
def get_maintenance_job(
    job_id: str,
    request: Request,
) -> MaintenanceJobResponse:
    store = require_store(
        request
    )

    job = (
        store.get_maintenance_job(
            job_id
        )
    )

    if job is None:
        raise HTTPException(
            status_code=(
                status.HTTP_404_NOT_FOUND
            ),
            detail=(
                "Maintenance job not found"
            ),
        )

    return MaintenanceJobResponse(
        **job
    )


@router.post(
    "",
    response_model=(
        MaintenanceJobResponse
    ),
    status_code=(
        status.HTTP_201_CREATED
    ),
)
def create_maintenance_job(
    payload: MaintenanceJobCreate,
    request: Request,
    x_admin_key: str | None = Header(
        default=None,
        alias="X-Admin-Key",
    ),
) -> MaintenanceJobResponse:
    verify_admin_key(
        x_admin_key
    )

    store = require_store(
        request
    )

    account = store.get_account(
        payload.account_id
    )

    if account is None:
        raise HTTPException(
            status_code=(
                status.HTTP_404_NOT_FOUND
            ),
            detail="Account not found",
        )

    if payload.site_id:
        site = store.get_site(
            payload.site_id
        )

        if site is None:
            raise HTTPException(
                status_code=(
                    status.HTTP_404_NOT_FOUND
                ),
                detail="Site not found",
            )

        if (
            str(
                site["account_id"]
            )
            != payload.account_id
        ):
            raise HTTPException(
                status_code=400,
                detail=(
                    "Site does not belong "
                    "to account"
                ),
            )

    if payload.station_id:
        station = store.get_station(
            payload.station_id
        )

        if station is None:
            raise HTTPException(
                status_code=(
                    status.HTTP_404_NOT_FOUND
                ),
                detail=(
                    "Station not found"
                ),
            )

        if (
            payload.site_id
            and station.get(
                "site_id"
            )
            != payload.site_id
        ):
            raise HTTPException(
                status_code=400,
                detail=(
                    "Station does not belong "
                    "to site"
                ),
            )

    job = (
        store.create_maintenance_job(
            {
                "account_id": (
                    payload.account_id
                ),
                "site_id": (
                    payload.site_id
                ),
                "station_id": (
                    payload.station_id
                ),
                "source_alert_id": (
                    payload.source_alert_id
                ),
                "title": (
                    payload.title
                ),
                "description": (
                    payload.description
                ),
                "job_type": (
                    payload.job_type
                ),
                "priority": (
                    payload.priority
                ),
                "status": (
                    "scheduled"
                ),
                "scheduled_at": (
                    payload.scheduled_at.isoformat()
                    if payload.scheduled_at
                    else None
                ),
                "notes": (
                    payload.notes
                ),
            }
        )
    )

    return MaintenanceJobResponse(
        **job
    )


@router.patch(
    "/{job_id}",
    response_model=(
        MaintenanceJobResponse
    ),
)
def update_maintenance_job(
    job_id: str,
    payload: MaintenanceStatusUpdate,
    request: Request,
    x_admin_key: str | None = Header(
        default=None,
        alias="X-Admin-Key",
    ),
) -> MaintenanceJobResponse:
    verify_admin_key(
        x_admin_key
    )

    store = require_store(
        request
    )

    existing = (
        store.get_maintenance_job(
            job_id
        )
    )

    if existing is None:
        raise HTTPException(
            status_code=(
                status.HTTP_404_NOT_FOUND
            ),
            detail=(
                "Maintenance job not found"
            ),
        )

    now = datetime.now(
        timezone.utc
    )

    update_payload: dict = {
        "status": payload.status,
    }

    if payload.notes is not None:
        update_payload[
            "notes"
        ] = payload.notes

    if (
        payload.status
        == "in_progress"
        and not existing.get(
            "started_at"
        )
    ):
        update_payload[
            "started_at"
        ] = now.isoformat()

    if (
        payload.status
        == "completed"
    ):
        update_payload[
            "completed_at"
        ] = now.isoformat()

    job = (
        store.update_maintenance_job(
            job_id,
            update_payload,
        )
    )

    if job is None:
        raise HTTPException(
            status_code=(
                status.HTTP_404_NOT_FOUND
            ),
            detail=(
                "Maintenance job not found"
            ),
        )

    return MaintenanceJobResponse(
        **job
    )