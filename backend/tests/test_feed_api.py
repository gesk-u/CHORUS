"""The /feed JSON must match frontend/src/types/news.ts. No database needed."""

from fastapi.testclient import TestClient

from app.core.db import get_session
from app.main import app
from app.schemas.feed import FeedOut, SoloStoryOut, StoryOut, VersionOut
from app.services import feed as feed_service

VERSION = VersionOut(
    outlet=0, outlet_name="Reuters", title="h", url="https://x/1", minutes_ago=3, in_tune=91
)


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
                in_tune=91, versions=[VERSION],
            )
        ],
        solo_stories=[SoloStoryOut(outlet=5, title="solo", color="#f4d932", url="https://x/2")],
    )
    body = _client(monkeypatch, feed).get("/feed").json()

    assert set(body) == {"stories", "soloStories"}
    assert set(body["stories"][0]) == {
        "id", "topic", "time", "outlets", "extraVoices",
        "title", "deck", "reason", "color", "art", "inTune", "versions",
    }
    assert body["stories"][0]["versions"][0] == {
        "outlet": 0, "outletName": "Reuters", "title": "h",
        "url": "https://x/1", "minutesAgo": 3, "inTune": 91,
    }
    assert body["soloStories"][0] == {
        "outlet": 5, "title": "solo", "color": "#f4d932", "url": "https://x/2",
    }


def test_offstage_outlet_is_sent_as_null(monkeypatch):
    # The frontend relies on `outlet: null` (not a missing key) for outlets not on stage.
    offstage = VERSION.model_copy(update={"outlet": None})
    story = StoryOut(
        id=3, topic="AI", time=1, outlets=[], extra_voices=1, title="t", deck="d",
        reason="r", color="#f4d932", art="robot", in_tune=80, versions=[offstage],
    )
    body = _client(monkeypatch, FeedOut(stories=[story], solo_stories=[])).get("/feed").json()
    assert body["stories"][0]["versions"][0]["outlet"] is None


def test_feed_defaults_extra_voices_to_zero(monkeypatch):
    story = StoryOut(
        id=2, topic="Climate", time=10, outlets=[1, 3], title="t", deck="d",
        reason="r", color="#83c89b", art="battery", in_tune=88, versions=[VERSION],
    )
    body = _client(monkeypatch, FeedOut(stories=[story], solo_stories=[])).get("/feed").json()
    assert body["stories"][0]["extraVoices"] == 0


def test_health():
    assert TestClient(app).get("/health").json() == {"status": "ok"}
