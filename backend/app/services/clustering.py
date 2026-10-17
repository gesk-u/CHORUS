"""Groups articles about the same event into Stories.

Online step (every ingest): each new article joins the nearest recent story if
it is close enough, otherwise it starts a new story. pgvector's HNSW index makes
the nearest-story lookup fast.

Batch step (`cluster_embeddings`): scikit-learn agglomerative clustering, for
re-clustering a window offline, e.g. after tuning the threshold.
"""

from datetime import timedelta

import numpy as np
from sklearn.cluster import AgglomerativeClustering
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.models import Article, Story
from app.models.base import utcnow
from app.services.embeddings import article_text
from app.services.topics import classify_topic
from app.services.vectors import add_to_centroid


async def assign_to_story(session: AsyncSession, article: Article) -> Story:
    """Attaches `article` (which must have an embedding) to a new or existing Story."""
    settings = get_settings()
    since = utcnow() - timedelta(hours=settings.cluster_window_hours)
    distance = Story.centroid.cosine_distance(article.embedding)

    row = (
        await session.execute(
            select(Story, distance.label("distance"))
            .where(Story.updated_at >= since)
            .order_by(distance)
            .limit(1)
        )
    ).first()

    if row is not None and row.distance <= settings.cluster_distance_threshold:
        story = row.Story
        story.centroid = add_to_centroid(story.centroid, story.article_count, article.embedding)
        story.article_count += 1
        story.updated_at = utcnow()
    else:
        story = Story(
            title=article.title,
            deck=article.summary,
            topic=classify_topic(article_text(article.title, article.summary)),
            centroid=article.embedding,
            article_count=1,
            first_seen_at=article.published_at,
            updated_at=utcnow(),
        )
        session.add(story)

    article.story = story
    # Flush so the next article in this batch can find this story.
    await session.flush()
    return story


def cluster_embeddings(embeddings: np.ndarray, distance_threshold: float) -> np.ndarray:
    """Batch clustering: returns a cluster label per row of `embeddings`."""
    if len(embeddings) < 2:
        return np.zeros(len(embeddings), dtype=int)
    model = AgglomerativeClustering(
        n_clusters=None,
        metric="cosine",
        linkage="average",
        distance_threshold=distance_threshold,
    )
    return model.fit_predict(embeddings)
