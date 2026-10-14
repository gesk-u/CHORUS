from datetime import UTC, datetime

from sqlalchemy.orm import DeclarativeBase

# all-MiniLM-L6-v2 produces 384-dimensional vectors. Changing the model means a migration.
EMBEDDING_DIM = 384


def utcnow() -> datetime:
    return datetime.now(UTC)


class Base(DeclarativeBase):
    pass
