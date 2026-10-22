from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import feed, health, interactions
from app.core.config import get_settings

app = FastAPI(title="CHORUS API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(feed.router)
app.include_router(interactions.router)
