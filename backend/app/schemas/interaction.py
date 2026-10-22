from pydantic import Field

from app.schemas.common import CamelModel, InteractionKind


class InteractionIn(CamelModel):
    reader_id: int
    story_id: int
    kind: InteractionKind
    dwell_seconds: float | None = Field(default=None, ge=0)


class InteractionOut(CamelModel):
    id: int
