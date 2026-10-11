"""Import every model here so Alembic and relationships can see them."""

from app.models.article import Article
from app.models.base import EMBEDDING_DIM, Base
from app.models.interaction import Interaction
from app.models.outlet import Outlet
from app.models.reader import Reader
from app.models.story import Story

__all__ = ["EMBEDDING_DIM", "Article", "Base", "Interaction", "Outlet", "Reader", "Story"]
