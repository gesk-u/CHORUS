"""Background ingest worker.

    uv run python -m app.worker          # run every INGEST_INTERVAL_MINUTES
    uv run python -m app.worker --once   # run a single ingest and exit
"""

import argparse
import asyncio
import logging
from datetime import datetime

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from app.core.config import get_settings
from app.services.ingest import ingest_all


async def main(once: bool) -> None:
    if once:
        print(await ingest_all())
        return
    scheduler = AsyncIOScheduler()
    scheduler.add_job(
        ingest_all,
        "interval",
        minutes=get_settings().ingest_interval_minutes,
        next_run_time=datetime.now(),
        max_instances=1,
    )
    scheduler.start()
    await asyncio.Event().wait()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--once", action="store_true", help="ingest once and exit")
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    asyncio.run(main(parser.parse_args().once))
