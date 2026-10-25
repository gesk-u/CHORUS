from app.schemas.common import CamelModel, StoryArtKind, StoryTopic


class VersionOut(CamelModel):
    """One outlet's take on a story. Mirrors `StoryVersion` in frontend/src/types/news.ts."""

    outlet: int | None  # stage position; None = outlet not drawn on stage
    outlet_name: str
    title: str
    url: str
    minutes_ago: int
    in_tune: int  # 0-100: how close this article is to the story's centre


class StoryOut(CamelModel):
    """Mirrors `Story` in frontend/src/types/news.ts."""

    id: int
    topic: StoryTopic
    time: int  # minutes since first seen
    outlets: list[int]  # outlet positions (indexes into the frontend voices list)
    extra_voices: int = 0  # outlets covering it that aren't drawn on stage
    title: str
    deck: str
    reason: str
    color: str
    art: StoryArtKind
    in_tune: int  # average of the versions' in_tune
    versions: list[VersionOut]  # ordered by who published first


class SoloStoryOut(CamelModel):
    """Mirrors `SoloStory` in frontend/src/types/news.ts."""

    outlet: int
    title: str
    color: str
    url: str


class FeedOut(CamelModel):
    """Mirrors `Feed` in frontend/src/types/news.ts."""

    stories: list[StoryOut]
    solo_stories: list[SoloStoryOut]
