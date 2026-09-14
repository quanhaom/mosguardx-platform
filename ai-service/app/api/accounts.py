from fastapi import (
    APIRouter,
    Header,
    HTTPException,
    Query,
    Request,
    status,
)

from ..schemas import (
    AccountCreate,
    AccountResponse,
)

from .deps import (
    require_store,
    verify_admin_key,
)


router = APIRouter(
    prefix="/v1/accounts",
    tags=["accounts"],
)


@router.get(
    "",
    response_model=list[
        AccountResponse
    ],
)
def list_accounts(
    request: Request,

    account_type: (
        str | None
    ) = Query(
        default=None,
        alias="type",
    ),

    status_filter: (
        str | None
    ) = Query(
        default=None,
        alias="status",
    ),

) -> list[
    AccountResponse
]:
    if account_type not in {
        None,
        "household",
        "organization",
        "authority",
    }:
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid account type"
            ),
        )

    if status_filter not in {
        None,
        "active",
        "inactive",
        "suspended",
    }:
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid account status"
            ),
        )

    store = require_store(
        request
    )

    accounts = (
        store.list_accounts(
            account_type=(
                account_type
            ),
            status=(
                status_filter
            ),
        )
    )

    return [
        AccountResponse(
            **account
        )
        for account
        in accounts
    ]


@router.get(
    "/{account_id}",
    response_model=(
        AccountResponse
    ),
)
def get_account(
    account_id: str,
    request: Request,
) -> AccountResponse:
    store = require_store(
        request
    )

    account = (
        store.get_account(
            account_id
        )
    )

    if account is None:
        raise HTTPException(
            status_code=(
                status
                .HTTP_404_NOT_FOUND
            ),
            detail=(
                "Account not found"
            ),
        )

    return AccountResponse(
        **account
    )


@router.post(
    "",
    response_model=(
        AccountResponse
    ),
    status_code=(
        status.HTTP_201_CREATED
    ),
)
def create_account(
    payload: AccountCreate,

    request: Request,

    x_admin_key: (
        str | None
    ) = Header(
        default=None,
        alias="X-Admin-Key",
    ),

) -> AccountResponse:
    verify_admin_key(
        x_admin_key
    )

    store = require_store(
        request
    )

    if payload.slug:
        existing = (
            store
            .get_account_by_slug(
                payload.slug
            )
        )

        if existing is not None:
            raise HTTPException(
                status_code=(
                    status
                    .HTTP_409_CONFLICT
                ),
                detail=(
                    "Account slug "
                    "already exists"
                ),
            )

    account = (
        store.create_account(
            {
                "type":
                    payload.type,

                "name":
                    payload.name,

                "slug":
                    payload.slug,

                "status":
                    "active",

                "metadata":
                    payload.metadata,
            }
        )
    )

    return AccountResponse(
        **account
    )