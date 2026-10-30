from fastapi import APIRouter
from sqlalchemy import func, select

from app.api.deps import SessionDep
from app.models import Article, IngestRun, Outlet
from app.schemas.ingest import IngestStatusOut, OutletRunOut

router = APIRouter(tags=["ingest"])


@router.get("/ingest/status", response_model=IngestStatusOut)
async def ingest_status(session: SessionDep) -> IngestStatusOut:
    """Is news still flowing? The latest fetch result for each outlet."""
    latest = (
        select(func.max(IngestRun.id).label("id")).group_by(IngestRun.outlet_id).subquery()
    )
    rows = (
        await session.execute(
            select(IngestRun, Outlet.name)
            .join(latest, IngestRun.id == latest.c.id)
            .join(Outlet, Outlet.id == IngestRun.outlet_id)
            .order_by(Outlet.position)
        )
    ).all()
    outlets = [
        OutletRunOut(
            outlet_name=name,
            status=run.status,
            new_articles=run.new_articles,
            duration_ms=run.duration_ms,
            error=run.error,
            started_at=run.started_at,
        )
        for run, name in rows
    ]
    return IngestStatusOut(
        last_run_at=max((o.started_at for o in outlets), default=None),
        articles_total=await session.scalar(select(func.count()).select_from(Article)) or 0,
        outlets=outlets,
    )
