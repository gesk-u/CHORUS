"""Fetches outlet RSS feeds, stores new articles, embeds them and groups them into stories."""

import asyncio
import html
import logging
import re
import time
from dataclasses import dataclass
from datetime import UTC, datetime

import feedparser
import httpx
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import SessionLocal, engine
from app.models import Article, IngestRun, Outlet
from app.models.base import utcnow
from app.services.clustering import assign_to_story
from app.services.embeddings import article_text, embed_texts

log = logging.getLogger(__name__)

_TAGS = re.compile(r"<[^>]+>")
USER_AGENT = "CHORUS/0.1 (news aggregator)"
# Postgres advisory lock id: only one ingest may run at a time, across all processes.
INGEST_LOCK_ID = 727_001


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

    # The model is CPU-heavy: run it in a thread so the event loop stays responsive.
    texts = [article_text(e.title, e.summary) for e in fresh]
    vectors = await asyncio.to_thread(embed_texts, texts)
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


async def _ingest_outlets(session: AsyncSession) -> dict[str, int]:
    results: dict[str, int] = {}
    # Plain tuples: a rollback expires ORM objects, which can't lazy-load under asyncio.
    outlets = (
        await session.execute(
            select(Outlet.id, Outlet.name, Outlet.feed_url).where(
                Outlet.active.is_(True), Outlet.feed_url.is_not(None)
            )
        )
    ).all()
    async with httpx.AsyncClient(
        timeout=20, follow_redirects=True, headers={"User-Agent": USER_AGENT}
    ) as client:
        for outlet_id, name, feed_url in outlets:
            run = IngestRun(outlet_id=outlet_id, started_at=utcnow(), status="ok")
            started = time.perf_counter()
            try:
                run.new_articles = await ingest_outlet(session, client, outlet_id, feed_url)
            except Exception as exc:
                await session.rollback()
                log.exception("Ingest failed for %s", name)
                run.status = "error"
                run.error = f"{type(exc).__name__}: {exc}"[:500]
            run.duration_ms = round((time.perf_counter() - started) * 1000)
            session.add(run)
            await session.commit()
            results[name] = run.new_articles if run.status == "ok" else -1
    return results


async def ingest_all() -> dict[str, int]:
    """Ingests every active outlet with a feed. One failing outlet doesn't stop the rest.

    Returns {outlet name: new articles}, -1 for failures, or {} if another
    ingest is already running.
    """
    # A dedicated connection holds the advisory lock for the whole run.
    async with engine.connect() as lock_conn:
        got_lock = await lock_conn.scalar(
            text("SELECT pg_try_advisory_lock(:id)"), {"id": INGEST_LOCK_ID}
        )
        await lock_conn.commit()
        if not got_lock:
            log.info("Another ingest is already running; skipping this one.")
            return {}
        try:
            async with SessionLocal() as session:
                results = await _ingest_outlets(session)
        finally:
            await lock_conn.execute(
                text("SELECT pg_advisory_unlock(:id)"), {"id": INGEST_LOCK_ID}
            )
            await lock_conn.commit()
    log.info("Ingest finished: %s", results)
    return results
