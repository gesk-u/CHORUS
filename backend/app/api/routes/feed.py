from fastapi import APIRouter

from app.api.deps import SessionDep
from app.schemas.feed import FeedOut, FeedVersionOut
from app.services import feed as feed_service

router = APIRouter(tags=["feed"])


@router.get("/feed", response_model=FeedOut)
async def get_feed(session: SessionDep, reader_id: int | None = None) -> FeedOut:
    """Home feed. Pass `reader_id` to rank by that reader's learned taste."""
    return await feed_service.build_feed(session, reader_id)


@router.get("/feed/version", response_model=FeedVersionOut)
async def get_feed_version(session: SessionDep) -> FeedVersionOut:
    """Tiny response the page polls; when `version` changes, it reloads the feed."""
    return FeedVersionOut(version=await feed_service.feed_version(session))
