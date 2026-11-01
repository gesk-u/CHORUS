"""Recommender scoring: freshness, loudness, profile drift and the "why" line."""

import numpy as np
import pytest

from app.services.recommender import (
    FRESHNESS_HALF_LIFE_MINUTES,
    MAX_VOICES,
    as_array,
    explain,
    freshness,
    loudness,
    score_story,
    update_profile,
)
from app.services.vectors import cosine_similarity, normalize


def test_freshness_halves_every_half_life():
    assert freshness(0) == 1
    assert freshness(FRESHNESS_HALF_LIFE_MINUTES) == pytest.approx(0.5)
    assert freshness(2 * FRESHNESS_HALF_LIFE_MINUTES) == pytest.approx(0.25)


def test_freshness_treats_future_timestamps_as_brand_new():
    assert freshness(-30) == 1


def test_loudness_is_capped():
    assert loudness(0) == 0
    assert loudness(MAX_VOICES) == 1
    assert loudness(MAX_VOICES * 3) == 1


def test_without_profile_louder_and_fresher_rank_higher():
    loud, relevance = score_story(None, [1, 0], voices=10, age_minutes=60)
    quiet, _ = score_story(None, [1, 0], voices=2, age_minutes=60)
    old, _ = score_story(None, [1, 0], voices=10, age_minutes=48 * 60)
    assert relevance == 0
    assert loud > quiet
    assert loud > old


def test_relevance_outweighs_loudness_and_freshness():
    profile = normalize([1, 0])
    on_topic_old_quiet, _ = score_story(profile, [1, 0], voices=2, age_minutes=24 * 60)
    off_topic_new_loud, _ = score_story(profile, [0, 1], voices=MAX_VOICES, age_minutes=0)
    assert on_topic_old_quiet > off_topic_new_loud


def test_save_moves_profile_further_than_open():
    start = normalize([1, 0])
    story = [0, 1]
    opened = update_profile(start, story, "open")
    saved = update_profile(start, story, "save")
    assert cosine_similarity(saved, story) > cosine_similarity(opened, story)


def test_unknown_interaction_leaves_profile_unchanged():
    start = normalize([0.6, 0.8])
    assert np.allclose(update_profile(start, [1, 0], "hover"), start)


@pytest.mark.parametrize("kind", ["open", "read", "save", "skip"])
def test_updated_profile_stays_unit_length(kind):
    profile = update_profile(normalize([1, 1]), [0.2, 0.9], kind)
    assert float(np.linalg.norm(profile)) == pytest.approx(1, abs=1e-6)


def test_first_read_starts_profile_at_the_story():
    profile = update_profile(None, [3, 4], "read")
    assert np.allclose(profile, [0.6, 0.8])


def test_explain_prefers_reading_history_then_relevance_then_loudness():
    assert explain("AI", {"AI": 2}, 0.9, 12) == "because you read 2 AI stories this week"
    assert explain("AI", {"AI": 1}, 0.5, 12) == "close to what you’ve been reading"
    assert explain("AI", {}, 0.2, 8) == "everyone is singing about this one"
    assert explain("AI", {}, 0.2, 3) == "fresh off the wire"


def test_as_array_keeps_none():
    assert as_array(None) is None
    assert as_array([1, 2]).dtype == np.float32
