from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.article import Article


class Outlet(Base):
    """A news source ("voice")."""

    __tablename__ = "outlets"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True)
    # Index in the frontend `voices` list (src/data/voices.ts). NULL = not drawn on stage;
    # such outlets still count toward a story's `extraVoices`.
    position: Mapped[int | None] = mapped_column(unique=True)
    feed_url: Mapped[str | None] = mapped_column(String(500))
    homepage: Mapped[str | None] = mapped_column(String(500))
    color: Mapped[str] = mapped_column(String(7), default="#cccccc")
    active: Mapped[bool] = mapped_column(default=True)

    articles: Mapped[list[Article]] = relationship(back_populates="outlet")
