"""The /feed JSON must match frontend/src/types/news.ts. No database needed."""

from fastapi.testclient import TestClient

from app.core.db import get_session
from app.main import app
from app.schemas.feed import FeedOut, SoloStoryOut, StoryOut
from app.services import feed as feed_service


async def _no_session():
    yield None


def _client(monkeypatch, feed: FeedOut) -> TestClient:
    async def fake_build_feed(session, reader_id=None):
        return feed

    monkeypatch.setattr(feed_service, "build_feed", fake_build_feed)
    app.dependency_overrides[get_session] = _no_session
    return TestClient(app)


def test_feed_uses_frontend_field_names(monkeypatch):
    feed = FeedOut(
        stories=[
            StoryOut(
                id=1, topic="AI", time=4, outlets=[0, 2], extra_voices=3,
                title="t", deck="d", reason="r", color="#f4d932", art="robot",
            )
        ],
        solo_stories=[SoloStoryOut(outlet=5, title="solo", color="#f4d932")],
    )
    body = _client(monkeypatch, feed).get("/feed").json()

    assert set(body) == {"stories", "soloStories"}
    assert set(body["stories"][0]) == {
        "id", "topic", "time", "outlets", "extraVoices",
        "title", "deck", "reason", "color", "art",
    }
    assert body["soloStories"][0] == {"outlet": 5, "title": "solo", "color": "#f4d932"}


def test_feed_omits_missing_extra_voices(monkeypatch):
    story = StoryOut(
        id=2, topic="Climate", time=10, outlets=[1, 3], title="t", deck="d",
        reason="r", color="#83c89b", art="battery",
    )
    body = _client(monkeypatch, FeedOut(stories=[story], solo_stories=[])).get("/feed").json()
    assert "extraVoices" not in body["stories"][0]


def test_health():
    assert TestClient(app).get("/health").json() == {"status": "ok"}
