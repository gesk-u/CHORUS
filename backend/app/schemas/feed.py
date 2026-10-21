from app.schemas.common import CamelModel, StoryArtKind, StoryTopic


class StoryOut(CamelModel):
    """Mirrors `Story` in frontend/src/types/news.ts."""

    id: int
    topic: StoryTopic
    time: int  # minutes since first seen
    outlets: list[int]  # outlet positions (indexes into the frontend voices list)
    extra_voices: int | None = None
    title: str
    deck: str
    reason: str
    color: str
    art: StoryArtKind


class SoloStoryOut(CamelModel):
    """Mirrors `SoloStory` in frontend/src/types/news.ts."""

    outlet: int
    title: str
    color: str


class FeedOut(CamelModel):
    """Mirrors `Feed` in frontend/src/types/news.ts."""

    stories: list[StoryOut]
    solo_stories: list[SoloStoryOut]
