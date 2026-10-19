"""Learns each reader's taste from how they read, and ranks stories with it.

v1 is deliberately simple and explainable:
- profile = a vector that drifts toward stories the reader reads/saves and
  away from ones they skip;
- score   = similarity to the profile + how many outlets cover it + freshness.

Once enough interactions exist, train a scikit-learn model (e.g.
LogisticRegression on [similarity, voices, age, topic]) to replace `score_story`.
"""

import math
from typing import Any

import numpy as np

from app.services.vectors import Vec, cosine_similarity, normalize

# How far one interaction moves the profile toward (+) or away from (-) a story.
INTERACTION_WEIGHTS: dict[str, float] = {"open": 0.05, "read": 0.15, "save": 0.3, "skip": -0.1}

FRESHNESS_HALF_LIFE_MINUTES = 12 * 60
MAX_VOICES = 12


def update_profile(profile: Any | None, story_vector: Any, kind: str) -> Vec | None:
    weight = INTERACTION_WEIGHTS.get(kind, 0.0)
    story = normalize(story_vector)
    if profile is None:
        return story if weight > 0 else None
    current = normalize(profile)
    if weight >= 0:
        return normalize(current + weight * (story - current))
    return normalize(current + weight * story)


def freshness(age_minutes: float) -> float:
    return math.pow(0.5, max(age_minutes, 0) / FRESHNESS_HALF_LIFE_MINUTES)


def loudness(voices: int) -> float:
    return min(voices, MAX_VOICES) / MAX_VOICES


def score_story(
    profile: Any | None, centroid: Any, voices: int, age_minutes: float
) -> tuple[float, float]:
    """Returns (score, relevance). Without a profile, ranks by loudness and freshness."""
    if profile is None:
        return 0.6 * loudness(voices) + 0.4 * freshness(age_minutes), 0.0
    relevance = cosine_similarity(profile, centroid)
    score = 0.6 * relevance + 0.25 * loudness(voices) + 0.15 * freshness(age_minutes)
    return score, relevance


def explain(topic: str, topic_reads: dict[str, int], relevance: float, voices: int) -> str:
    """The short "why you're seeing this" line under each story card."""
    reads = topic_reads.get(topic, 0)
    if reads >= 2:
        return f"because you read {reads} {topic} stories this week"
    if relevance >= 0.5:
        return "close to what you’ve been reading"
    if voices >= 8:
        return "everyone is singing about this one"
    return "fresh off the wire"


def as_array(value: Any | None) -> np.ndarray | None:
    return None if value is None else np.asarray(value, dtype=np.float32)
