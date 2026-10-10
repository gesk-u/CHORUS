from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """App settings, read from environment variables or a .env file."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+asyncpg://chorus:chorus@localhost:5432/chorus"
    cors_origins: list[str] = ["http://localhost:3000"]

    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    # An article joins the nearest recent story if its cosine distance is at most this.
    cluster_distance_threshold: float = 0.25
    cluster_window_hours: int = 48

    feed_window_hours: int = 48
    ingest_interval_minutes: int = 10


@lru_cache
def get_settings() -> Settings:
    return Settings()
