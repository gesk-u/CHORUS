"""Builds the home feed: ranked multi-outlet stories plus single-outlet "solos"."""

from collections.abc import Iterable
from datetime import datetime, timedelta

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.config import get_settings
from app.models import Article, Interaction, Reader, Story
from app.models.base import utcnow
from app.schemas.feed import FeedOut, SoloStoryOut, StoryOut
from app.services.recommender import as_array, explain, score_story
from app.services.topics import topic_style

MAX_STORIES = 30
MAX_SOLOS = 6


def outlet_lineup(articles: Iterable[tuple[int, int | None, datetime]]) -> tuple[list[int], int]:
    """From (outlet_id, outlet_position, published_at) rows, returns
    (stage positions ordered by who published first, count of off-stage outlets)."""
    positions: list[int] = []
    seen: set[int] = set()
    extra = 0
    for outlet_id, position, _ in sorted(articles, key=lambda a: a[2]):
        if outlet_id in seen:
            continue
        seen.add(outlet_id)
        if position is None:
            extra += 1
        else:
            positions.append(position)
    return positions, extra


def minutes_since(moment: datetime, now: datetime) -> int:
    return max(0, int((now - moment).total_seconds() // 60))


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
        positions, extra = outlet_lineup(
            (a.outlet_id, a.outlet.position, a.published_at) for a in story.articles
        )
        voices = len(positions) + extra
        color, art = topic_style(story.topic)

        if voices < 2:
            if positions:
                solo = SoloStoryOut(outlet=positions[0], title=story.title, color=color)
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
                    extra_voices=extra or None,
                    title=story.title,
                    deck=story.deck or "",
                    reason=explain(story.topic, topic_reads, relevance, voices),
                    color=color,
                    art=art,
                ),
            )
        )

    ranked.sort(key=lambda item: item[0], reverse=True)
    solos.sort(key=lambda item: item[0], reverse=True)
    return FeedOut(
        stories=[story for _, story in ranked[:MAX_STORIES]],
        solo_stories=[solo for _, solo in solos[:MAX_SOLOS]],
    )
