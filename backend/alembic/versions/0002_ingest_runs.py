"""Track every feed fetch in ingest_runs.

Revision ID: 0002
Revises: 0001
Create Date: 2026-11-01
"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "0002"
down_revision: str | None = "0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "ingest_runs",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column(
            "outlet_id",
            sa.Integer,
            sa.ForeignKey("outlets.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("status", sa.String(10), nullable=False),
        sa.Column("new_articles", sa.Integer, nullable=False),
        sa.Column("duration_ms", sa.Integer, nullable=False),
        sa.Column("error", sa.Text),
    )
    op.create_index("ix_ingest_runs_outlet_id", "ingest_runs", ["outlet_id"])
    op.create_index("ix_ingest_runs_started_at", "ingest_runs", ["started_at"])


def downgrade() -> None:
    op.drop_table("ingest_runs")
