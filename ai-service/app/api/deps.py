from hmac import compare_digest

from fastapi import (
    HTTPException,
    Request,
    status,
)

from ..backend import BackendStore
from ..config import get_settings


settings = get_settings()


def require_store(
    request: Request,
) -> BackendStore:
    store = (
        request.app.state.store
    )

    if store is None:
        raise HTTPException(
            status_code=(
                status
                .HTTP_503_SERVICE_UNAVAILABLE
            ),
            detail=(
                "Storage backend "
                "is not ready"
            ),
        )

    return store


def verify_admin_key(
    provided_key: str | None,
) -> None:
    if not settings.admin_api_key:
        raise HTTPException(
            status_code=(
                status
                .HTTP_503_SERVICE_UNAVAILABLE
            ),
            detail=(
                "ADMIN_API_KEY "
                "is not configured"
            ),
        )

    if (
        not provided_key
        or not compare_digest(
            provided_key,
            settings.admin_api_key,
        )
    ):
        raise HTTPException(
            status_code=(
                status
                .HTTP_401_UNAUTHORIZED
            ),
            detail=(
                "Invalid admin key"
            ),
        )