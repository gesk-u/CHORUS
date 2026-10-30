from datetime import datetime

from app.schemas.common import CamelModel


class OutletRunOut(CamelModel):
    outlet_name: str
    status: str
    new_articles: int
    duration_ms: int
    error: str | None
    started_at: datetime


class IngestStatusOut(CamelModel):
    last_run_at: datetime | None
    articles_total: int
    outlets: list[OutletRunOut]  # latest run per outlet
