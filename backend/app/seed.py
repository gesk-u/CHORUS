"""Inserts the outlets from the design plus a demo reader. Safe to run repeatedly.

    uv run python -m app.seed

`position` must match the order of `voices` in frontend/src/data/voices.ts.
Feed URLs were the outlets' public RSS addresses at the time of writing; check
any that fail during ingest. Outlets without a public feed have feed_url=None.
"""

import asyncio

from sqlalchemy import select

from app.core.db import SessionLocal
from app.models import Outlet, Reader

OUTLETS: list[tuple[str, str, str | None]] = [
    ("Reuters", "#f05b46", None),  # no public RSS; needs a licensed feed
    ("The Verge", "#f4d932", "https://www.theverge.com/rss/index.xml"),
    ("WIRED", "#82c59b", "https://www.wired.com/feed/rss"),
    ("Bloomberg", "#ee91a4", "https://feeds.bloomberg.com/technology/news.rss"),
    ("Ars Technica", "#7fb7eb", "https://feeds.arstechnica.com/arstechnica/index"),
    ("404 Media", "#bd91d4", "https://www.404media.co/rss/"),
    ("MIT Tech Review", "#f3973f", "https://www.technologyreview.com/feed/"),
    ("TechCrunch", "#93c968", "https://techcrunch.com/feed/"),
    ("Rest of World", "#f2b9d0", "https://restofworld.org/feed/latest"),
    ("Financial Times", "#f3bca2", "https://www.ft.com/technology?format=rss"),
    ("Semafor", "#7bcbd0", "https://www.semafor.com/rss.xml"),
    ("IEEE Spectrum", "#a4a8ed", "https://spectrum.ieee.org/feeds/feed.rss"),
]


async def seed() -> None:
    async with SessionLocal() as session:
        existing = set(await session.scalars(select(Outlet.name)))
        for position, (name, color, feed_url) in enumerate(OUTLETS):
            if name not in existing:
                session.add(Outlet(name=name, position=position, color=color, feed_url=feed_url))
        if await session.scalar(select(Reader.id).limit(1)) is None:
            session.add(Reader(name="Ana"))
        await session.commit()
    print(f"Seeded {len(OUTLETS)} outlets and a demo reader.")


if __name__ == "__main__":
    asyncio.run(seed())
