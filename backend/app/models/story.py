from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING, Any

from pgvector.sqlalchemy import Vector
from sqlalchemy import DateTime, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import EMBEDDING_DIM, Base, utcnow

if TYPE_CHECKING:
    from app.models.article import Article


class Story(Base):
    """A cluster of articles about the same event (one card in the setlist)."""

    __tablename__ = "stories"
    __table_args__ = (
        # Approximate nearest-neighbour index for "which story is this article closest to?"
        Index(
            "ix_stories_centroid_hnsw",
            "centroid",
            postgresql_using="hnsw",
            postgresql_with={"m": 16, "ef_construction": 64},
            postgresql_ops={"centroid": "vector_cosine_ops"},
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(500))
    deck: Mapped[str | None] = mapped_column(Text)
    topic: Mapped[str] = mapped_column(String(20), index=True)
    # Normalized mean of the member articles' embeddings.
    centroid: Mapped[Any] = mapped_column(Vector(EMBEDDING_DIM))
    article_count: Mapped[int] = mapped_column(default=0)
    first_seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, index=True
    )

    articles: Mapped[list[Article]] = relationship(back_populates="story")
