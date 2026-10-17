from typing import Literal

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

# Keep these in sync with frontend/src/types/news.ts
StoryTopic = Literal["AI", "Startups", "Climate", "Security", "Science"]
StoryArtKind = Literal["robot", "battery", "key", "satellite", "phone"]
InteractionKind = Literal["open", "read", "save", "skip"]


class CamelModel(BaseModel):
    """Serializes snake_case fields as camelCase JSON, like the frontend expects."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
