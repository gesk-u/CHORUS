from fastapi import APIRouter, HTTPException, status

from app.api.deps import SessionDep
from app.models import Interaction, Reader, Story
from app.schemas.interaction import InteractionIn, InteractionOut
from app.services.recommender import update_profile

router = APIRouter(tags=["interactions"])


@router.post("/interactions", response_model=InteractionOut, status_code=status.HTTP_201_CREATED)
async def record_interaction(body: InteractionIn, session: SessionDep) -> InteractionOut:
    """Records a reading signal and nudges the reader's taste profile."""
    reader = await session.get(Reader, body.reader_id)
    story = await session.get(Story, body.story_id)
    if reader is None or story is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Reader or story not found")

    interaction = Interaction(
        reader_id=reader.id,
        story_id=story.id,
        kind=body.kind,
        dwell_seconds=body.dwell_seconds,
    )
    session.add(interaction)
    reader.profile = update_profile(reader.profile, story.centroid, body.kind)
    await session.commit()
    return InteractionOut(id=interaction.id)
