from fastapi import APIRouter

from app.api.deps import SessionDep
from app.schemas.feed import FeedOut
from app.services import feed as feed_service

router = APIRouter(tags=["feed"])


@router.get("/feed", response_model=FeedOut)
async def get_feed(session: SessionDep, reader_id: int | None = None) -> FeedOut:
    """Home feed. Pass `reader_id` to rank by that reader's learned taste."""
    return await feed_service.build_feed(session, reader_id)
