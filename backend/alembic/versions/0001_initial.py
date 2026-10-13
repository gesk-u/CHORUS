"""Initial schema: outlets, stories, articles, readers, interactions.

Revision ID: 0001
Revises:
Create Date: 2026-11-01
"""
from collections.abc import Sequence

import sqlalchemy as sa
from pgvector.sqlalchemy import Vector

from alembic import op

revision: str = "0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

DIM = 384


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    op.create_table(
        "outlets",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String(120), nullable=False, unique=True),
        sa.Column("position", sa.Integer, unique=True),
        sa.Column("feed_url", sa.String(500)),
        sa.Column("homepage", sa.String(500)),
        sa.Column("color", sa.String(7), nullable=False),
        sa.Column("active", sa.Boolean, nullable=False),
    )

    op.create_table(
        "stories",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("title", sa.String(500), nullable=False),
        sa.Column("deck", sa.Text),
        sa.Column("topic", sa.String(20), nullable=False),
        sa.Column("centroid", Vector(DIM), nullable=False),
        sa.Column("article_count", sa.Integer, nullable=False),
        sa.Column("first_seen_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_stories_topic", "stories", ["topic"])
    op.create_index("ix_stories_updated_at", "stories", ["updated_at"])
    op.create_index(
        "ix_stories_centroid_hnsw",
        "stories",
        ["centroid"],
        postgresql_using="hnsw",
        postgresql_with={"m": 16, "ef_construction": 64},
        postgresql_ops={"centroid": "vector_cosine_ops"},
    )

    op.create_table(
        "articles",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column(
            "outlet_id",
            sa.Integer,
            sa.ForeignKey("outlets.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("story_id", sa.Integer, sa.ForeignKey("stories.id", ondelete="SET NULL")),
        sa.Column("url", sa.String(1000), nullable=False, unique=True),
        sa.Column("title", sa.String(500), nullable=False),
        sa.Column("summary", sa.Text),
        sa.Column("published_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("fetched_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("embedding", Vector(DIM)),
    )
    op.create_index("ix_articles_outlet_id", "articles", ["outlet_id"])
    op.create_index("ix_articles_story_id", "articles", ["story_id"])
    op.create_index("ix_articles_published_at", "articles", ["published_at"])

    op.create_table(
        "readers",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column("profile", Vector(DIM)),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )

    op.create_table(
        "interactions",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column(
            "reader_id",
            sa.Integer,
            sa.ForeignKey("readers.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "story_id",
            sa.Integer,
            sa.ForeignKey("stories.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("kind", sa.String(10), nullable=False),
        sa.Column("dwell_seconds", sa.Float),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_interactions_reader_id", "interactions", ["reader_id"])
    op.create_index("ix_interactions_story_id", "interactions", ["story_id"])
    op.create_index("ix_interactions_created_at", "interactions", ["created_at"])


def downgrade() -> None:
    op.drop_table("interactions")
    op.drop_table("readers")
    op.drop_table("articles")
    op.drop_table("stories")
    op.drop_table("outlets")
