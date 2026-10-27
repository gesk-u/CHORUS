"""Builds the home feed: ranked multi-outlet stories plus single-outlet "solos"."""

from collections.abc import Iterable
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.config import get_settings
from app.models import Article, Interaction, Reader, Story
from app.models.base import utcnow
from app.schemas.feed import FeedOut, SoloStoryOut, StoryOut, VersionOut
from app.services.recommender import as_array, explain, score_story
from app.services.topics import topic_style
from app.services.vectors import cosine_similarity

MAX_STORIES = 30
MAX_SOLOS = 6


@dataclass(frozen=True)
class ArticleRow:
    """The parts of an Article (and its Outlet) the feed needs."""

    outlet_id: int
    position: int | None
    outlet_name: str
    title: str
    url: str
    published_at: datetime
    embedding: Any

    @classmethod
    def from_article(cls, a: Article) -> "ArticleRow":
        return cls(
            a.outlet_id, a.outlet.position, a.outlet.name, a.title, a.url,
            a.published_at, a.embedding,
        )


def minutes_since(moment: datetime, now: datetime) -> int:
    return max(0, int((now - moment).total_seconds() // 60))


def in_tune(embedding: Any, centroid: Any) -> int:
    """0-100: how close an article sits to its story's centre."""
    if embedding is None or centroid is None:
        return 0
    return round(100 * max(0.0, cosine_similarity(embedding, centroid)))


def build_versions(rows: Iterable[ArticleRow], centroid: Any, now: datetime) -> list[VersionOut]:
    """One version per outlet, ordered by who published first.

    When an outlet wrote several articles about the story, its version is the
    one closest to the story's centre (its most on-topic piece).
    """
    by_outlet: dict[int, list[ArticleRow]] = {}
    for row in rows:
        by_outlet.setdefault(row.outlet_id, []).append(row)

    picked: list[tuple[datetime, VersionOut]] = []
    for articles in by_outlet.values():
        best = max(articles, key=lambda r: in_tune(r.embedding, centroid))
        first_published = min(r.published_at for r in articles)
        version = VersionOut(
            outlet=best.position,
            outlet_name=best.outlet_name,
            title=best.title,
            url=best.url,
            minutes_ago=minutes_since(best.published_at, now),
            in_tune=in_tune(best.embedding, centroid),
        )
        picked.append((first_published, version))

    picked.sort(key=lambda item: item[0])
    return [version for _, version in picked]


async def _topic_reads(session: AsyncSession, reader_id: int) -> dict[str, int]:
    since = utcnow() - timedelta(days=7)
    rows = await session.execute(
        select(Story.topic, func.count())
        .join(Interaction, Interaction.story_id == Story.id)
        .where(
            Interaction.reader_id == reader_id,
            Interaction.kind.in_(("read", "save")),
            Interaction.created_at >= since,
        )
        .group_by(Story.topic)
    )
    return {topic: count for topic, count in rows.all()}


async def build_feed(session: AsyncSession, reader_id: int | None = None) -> FeedOut:
    now = utcnow()
    since = now - timedelta(hours=get_settings().feed_window_hours)
    stories = (
        await session.scalars(
            select(Story)
            .where(Story.updated_at >= since)
            .options(selectinload(Story.articles).selectinload(Article.outlet))
        )
    ).all()

    reader = await session.get(Reader, reader_id) if reader_id is not None else None
    profile = as_array(reader.profile) if reader else None
    topic_reads = await _topic_reads(session, reader.id) if reader else {}

    ranked: list[tuple[float, StoryOut]] = []
    solos: list[tuple[datetime, SoloStoryOut]] = []

    for story in stories:
        versions = build_versions(
            (ArticleRow.from_article(a) for a in story.articles), story.centroid, now
        )
        positions = [v.outlet for v in versions if v.outlet is not None]
        extra = len(versions) - len(positions)
        voices = len(versions)
        color, art = topic_style(story.topic)

        if voices < 2:
            if positions:
                v = versions[0]
                solo = SoloStoryOut(outlet=positions[0], title=v.title, color=color, url=v.url)
                solos.append((story.first_seen_at, solo))
            continue

        age = minutes_since(story.first_seen_at, now)
        score, relevance = score_story(profile, story.centroid, voices, age)
        ranked.append(
            (
                score,
                StoryOut(
                    id=story.id,
                    topic=story.topic,  # type: ignore[arg-type]
                    time=age,
                    outlets=positions,
                    extra_voices=extra,
                    title=story.title,
                    deck=story.deck or "",
                    reason=explain(story.topic, topic_reads, relevance, voices),
                    color=color,
                    art=art,
                    in_tune=round(sum(v.in_tune for v in versions) / voices),
                    versions=versions,
                ),
            )
        )

    ranked.sort(key=lambda item: item[0], reverse=True)
    solos.sort(key=lambda item: item[0], reverse=True)
    return FeedOut(
        stories=[story for _, story in ranked[:MAX_STORIES]],
        solo_stories=[solo for _, solo in solos[:MAX_SOLOS]],
    )
