from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING, Any

from pgvector.sqlalchemy import Vector
from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import EMBEDDING_DIM, Base, utcnow

if TYPE_CHECKING:
    from app.models.outlet import Outlet
    from app.models.story import Story


class Article(Base):
    """One article from one outlet. Articles about the same event share a Story."""

    __tablename__ = "articles"

    id: Mapped[int] = mapped_column(primary_key=True)
    outlet_id: Mapped[int] = mapped_column(ForeignKey("outlets.id", ondelete="CASCADE"), index=True)
    story_id: Mapped[int | None] = mapped_column(
        ForeignKey("stories.id", ondelete="SET NULL"), index=True
    )
    url: Mapped[str] = mapped_column(String(1000), unique=True)
    title: Mapped[str] = mapped_column(String(500))
    summary: Mapped[str | None] = mapped_column(Text)
    published_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    fetched_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    embedding: Mapped[Any] = mapped_column(Vector(EMBEDDING_DIM), nullable=True)

    outlet: Mapped[Outlet] = relationship(back_populates="articles")
    story: Mapped[Story | None] = relationship(back_populates="articles")
