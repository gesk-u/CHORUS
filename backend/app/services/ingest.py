"""Fetches outlet RSS feeds, stores new articles, embeds them and groups them into stories."""

import html
import logging
import re
from dataclasses import dataclass
from datetime import UTC, datetime

import feedparser
import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import SessionLocal
from app.models import Article, Outlet
from app.models.base import utcnow
from app.services.clustering import assign_to_story
from app.services.embeddings import article_text, embed_texts

log = logging.getLogger(__name__)

_TAGS = re.compile(r"<[^>]+>")
USER_AGENT = "CHORUS/0.1 (news aggregator)"


@dataclass
class FeedEntry:
    url: str
    title: str
    summary: str | None
    published_at: datetime


def clean_html(text: str | None, limit: int = 1000) -> str | None:
    if not text:
        return None
    cleaned = " ".join(html.unescape(_TAGS.sub(" ", text)).split())
    return cleaned[:limit] or None


def parse_feed(content: bytes) -> list[FeedEntry]:
    parsed = feedparser.parse(content)
    entries: list[FeedEntry] = []
    for entry in parsed.entries:
        url, title = entry.get("link"), entry.get("title")
        if not url or not title:
            continue
        stamp = entry.get("published_parsed") or entry.get("updated_parsed")
        published = datetime(*stamp[:6], tzinfo=UTC) if stamp else utcnow()
        entries.append(
            FeedEntry(
                url=url,
                title=clean_html(title, 500) or title,
                summary=clean_html(entry.get("summary")),
                published_at=published,
            )
        )
    return entries


async def ingest_outlet(
    session: AsyncSession, client: httpx.AsyncClient, outlet_id: int, feed_url: str
) -> int:
    """Returns how many new articles were stored."""
    response = await client.get(feed_url)
    response.raise_for_status()
    entries = parse_feed(response.content)
    if not entries:
        return 0

    known = set(
        await session.scalars(select(Article.url).where(Article.url.in_([e.url for e in entries])))
    )
    fresh = [e for e in entries if e.url not in known]
    if not fresh:
        return 0

    vectors = embed_texts([article_text(e.title, e.summary) for e in fresh])
    for entry, vector in zip(fresh, vectors, strict=True):
        article = Article(
            outlet_id=outlet_id,
            url=entry.url,
            title=entry.title,
            summary=entry.summary,
            published_at=entry.published_at,
            embedding=vector,
        )
        session.add(article)
        await assign_to_story(session, article)
    await session.commit()
    return len(fresh)


async def ingest_all() -> dict[str, int]:
    """Ingests every active outlet with a feed. One failing outlet doesn't stop the rest."""
    results: dict[str, int] = {}
    async with SessionLocal() as session, httpx.AsyncClient(
        timeout=20, follow_redirects=True, headers={"User-Agent": USER_AGENT}
    ) as client:
        # Plain tuples: a rollback expires ORM objects, which can't lazy-load under asyncio.
        outlets = (
            await session.execute(
                select(Outlet.id, Outlet.name, Outlet.feed_url).where(
                    Outlet.active.is_(True), Outlet.feed_url.is_not(None)
                )
            )
        ).all()
        for outlet_id, name, feed_url in outlets:
            try:
                results[name] = await ingest_outlet(session, client, outlet_id, feed_url)
            except Exception:
                await session.rollback()
                log.exception("Ingest failed for %s", name)
                results[name] = -1
    log.info("Ingest finished: %s", results)
    return results
