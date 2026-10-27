from datetime import UTC, datetime, timedelta

import numpy as np
import pytest

from app.services.clustering import cluster_embeddings
from app.services.feed import ArticleRow, build_versions, minutes_since
from app.services.ingest import clean_html, parse_feed
from app.services.recommender import explain, score_story, update_profile
from app.services.topics import classify_topic
from app.services.vectors import add_to_centroid, cosine_similarity, normalize

T0 = datetime(2026, 11, 1, 9, 0, tzinfo=UTC)


# vectors -------------------------------------------------------------------

def test_add_to_centroid_is_normalized_mean():
    c = add_to_centroid([1, 0], 1, [0, 1])
    assert np.allclose(c, normalize([1, 1]))


def test_cosine_similarity():
    assert cosine_similarity([1, 0], [2, 0]) == pytest.approx(1)
    assert cosine_similarity([1, 0], [0, 1]) == pytest.approx(0)


# topics --------------------------------------------------------------------

@pytest.mark.parametrize(
    ("text", "topic"),
    [
        ("Open models close the gap with OpenAI", "AI"),
        ("Passkeys replace passwords at big banks", "Security"),
        ("Data centers help balance the power grid", "Climate"),
        ("NASA satellite texting goes mainstream", "Science"),
        ("Startup raises Series A for social app", "Startups"),
    ],
)
def test_classify_topic(text, topic):
    assert classify_topic(text) == topic


def test_short_keywords_match_whole_words_only():
    # "ai" must not match inside "said" or "air".
    assert classify_topic("She said the air was fresh") == "Startups"


# clustering ----------------------------------------------------------------

def test_cluster_embeddings_groups_similar_vectors():
    vecs = np.array([[1, 0, 0], [0.98, 0.05, 0], [0, 1, 0], [0.02, 0.99, 0]], dtype=np.float32)
    labels = cluster_embeddings(vecs, distance_threshold=0.2)
    assert labels[0] == labels[1]
    assert labels[2] == labels[3]
    assert labels[0] != labels[2]


def test_cluster_embeddings_single_row():
    assert list(cluster_embeddings(np.ones((1, 3)), 0.2)) == [0]


# feed ----------------------------------------------------------------------

def _row(outlet_id, position, minutes, title, embedding):
    return ArticleRow(
        outlet_id=outlet_id, position=position, outlet_name=f"Outlet {outlet_id}",
        title=title, url=f"https://x/{title}", published_at=T0 + timedelta(minutes=minutes),
        embedding=embedding,
    )


def test_build_versions_one_per_outlet_in_publish_order():
    centroid = [1, 0]
    rows = [
        _row(10, 3, 5, "a-first", [0.6, 0.8]),
        _row(11, 0, 0, "b", [1, 0]),
        _row(10, 3, 9, "a-closest", [0.99, 0.1]),  # same outlet again, more on-topic
        _row(12, None, 1, "c", [0.8, 0.6]),  # outlet not on stage
    ]
    versions = build_versions(rows, centroid, now=T0 + timedelta(minutes=30))

    assert [v.outlet for v in versions] == [0, None, 3]  # 11 published first, then 12, then 10
    assert versions[2].title == "a-closest"  # outlet 10's most on-topic article
    assert versions[2].minutes_ago == 21
    assert versions[0].in_tune == 100
    assert versions[1].in_tune == 80


def test_minutes_since_never_negative():
    assert minutes_since(T0 + timedelta(minutes=5), T0) == 0
    assert minutes_since(T0, T0 + timedelta(minutes=31)) == 31


# recommender ---------------------------------------------------------------

def test_profile_moves_toward_saved_story():
    start = normalize([1, 0])
    after = update_profile(start, [0, 1], "save")
    assert cosine_similarity(after, [0, 1]) > cosine_similarity(start, [0, 1])


def test_profile_moves_away_from_skipped_story():
    start = normalize([1, 1])
    after = update_profile(start, [0, 1], "skip")
    assert cosine_similarity(after, [0, 1]) < cosine_similarity(start, [0, 1])


def test_first_skip_does_not_create_profile():
    assert update_profile(None, [0, 1], "skip") is None


def test_relevant_story_scores_higher():
    profile = normalize([1, 0])
    relevant, _ = score_story(profile, [1, 0], voices=4, age_minutes=30)
    unrelated, _ = score_story(profile, [0, 1], voices=4, age_minutes=30)
    assert relevant > unrelated


def test_explain_mentions_reading_history():
    assert explain("AI", {"AI": 4}, 0.1, 3) == "because you read 4 AI stories this week"
    assert explain("AI", {}, 0.1, 10) == "everyone is singing about this one"


# ingest --------------------------------------------------------------------

def test_clean_html():
    assert clean_html("<p>Hello&nbsp;<b>world</b></p>") == "Hello world"
    assert clean_html(None) is None


def test_parse_feed():
    rss = b"""<?xml version="1.0"?><rss version="2.0"><channel><title>x</title>
      <item><title>Story one</title><link>https://example.com/1</link>
        <description>&lt;p&gt;Summary&lt;/p&gt;</description>
        <pubDate>Sun, 01 Nov 2026 09:00:00 GMT</pubDate></item>
      <item><title>No link</title></item>
    </channel></rss>"""
    entries = parse_feed(rss)
    assert len(entries) == 1
    assert entries[0].url == "https://example.com/1"
    assert entries[0].summary == "Summary"
    assert entries[0].published_at == T0
