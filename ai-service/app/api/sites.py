from fastapi import (
    APIRouter,
    Header,
    HTTPException,
    Query,
    Request,
    status,
)

from ..schemas import (
    SiteCreate,
    SiteResponse,
    StationResponse,
)

from .deps import (
    require_store,
    verify_admin_key,
)


router = APIRouter(
    prefix="/v1/sites",
    tags=["sites"],
)


@router.get(
    "",
    response_model=list[SiteResponse],
)
def list_sites(
    request: Request,
    account_id: str | None = Query(
        default=None
    ),
    status_filter: str | None = Query(
        default=None,
        alias="status",
    ),
) -> list[SiteResponse]:
    if status_filter not in {
        None,
        "active",
        "inactive",
    }:
        raise HTTPException(
            status_code=400,
            detail="Invalid site status",
        )

    store = require_store(
        request
    )

    return [
        SiteResponse(**site)
        for site in store.list_sites(
            account_id=account_id,
            status=status_filter,
        )
    ]


@router.get(
    "/{site_id}",
    response_model=SiteResponse,
)
def get_site(
    site_id: str,
    request: Request,
) -> SiteResponse:
    store = require_store(
        request
    )

    site = store.get_site(
        site_id
    )

    if site is None:
        raise HTTPException(
            status_code=(
                status.HTTP_404_NOT_FOUND
            ),
            detail="Site not found",
        )

    return SiteResponse(**site)


@router.get(
    "/{site_id}/stations",
    response_model=list[StationResponse],
)
def list_site_stations(
    site_id: str,
    request: Request,
) -> list[StationResponse]:
    store = require_store(
        request
    )

    site = store.get_site(
        site_id
    )

    if site is None:
        raise HTTPException(
            status_code=(
                status.HTTP_404_NOT_FOUND
            ),
            detail="Site not found",
        )

    return [
        StationResponse(**station)
        for station
        in store.list_stations_for_site(
            site_id
        )
    ]


@router.post(
    "",
    response_model=SiteResponse,
    status_code=(
        status.HTTP_201_CREATED
    ),
)
def create_site(
    payload: SiteCreate,
    request: Request,
    x_admin_key: str | None = Header(
        default=None,
        alias="X-Admin-Key",
    ),
) -> SiteResponse:
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

    if (
        payload.code
        and store.find_site_by_code(
            payload.account_id,
            payload.code,
        )
    ):
        raise HTTPException(
            status_code=(
                status.HTTP_409_CONFLICT
            ),
            detail=(
                "Site code already exists "
                "for this account"
            ),
        )

    site = store.create_site(
        {
            "account_id": (
                payload.account_id
            ),
            "code": payload.code,
            "name": payload.name,
            "site_type": (
                payload.site_type
            ),
            "address": (
                payload.address
            ),
            "latitude": (
                payload.latitude
            ),
            "longitude": (
                payload.longitude
            ),
            "timezone": (
                payload.timezone
            ),
            "status": "active",
            "metadata": (
                payload.metadata
            ),
        }
    )

    return SiteResponse(**site)