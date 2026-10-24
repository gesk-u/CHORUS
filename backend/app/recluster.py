"""Rebuilds all stories from the stored articles using the current threshold.

    uv run python -m app.recluster           # refuses if reader interactions exist
    uv run python -m app.recluster --force   # also deletes those interactions

Use after changing CLUSTER_DISTANCE_THRESHOLD. Articles are kept; only the
grouping is redone, in publish order, exactly as the ingest worker would.
"""

import argparse
import asyncio

from sqlalchemy import delete, func, select, update

from app.core.db import SessionLocal
from app.models import Article, Interaction, Story
from app.services.clustering import assign_to_story


async def recluster(force: bool) -> None:
    async with SessionLocal() as session:
        interactions = await session.scalar(select(func.count()).select_from(Interaction))
        if interactions and not force:
            print(
                f"{interactions} reader interactions point at current stories and would be "
                "deleted. Re-run with --force to continue."
            )
            return

        before = await session.scalar(select(func.count()).select_from(Story))
        await session.execute(update(Article).values(story_id=None))
        await session.execute(delete(Story))
        await session.flush()

        articles = (
            await session.scalars(
                select(Article)
                .where(Article.embedding.is_not(None))
                .order_by(Article.published_at)
            )
        ).all()
        for article in articles:
            await assign_to_story(session, article)
        await session.commit()

        after = await session.scalar(select(func.count()).select_from(Story))
        multi = await session.scalar(
            select(func.count()).select_from(Story).where(Story.article_count > 1)
        )
    print(f"{len(articles)} articles: {before} stories -> {after} ({multi} with 2+ articles)")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--force", action="store_true")
    asyncio.run(recluster(parser.parse_args().force))
