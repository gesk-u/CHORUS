"""Grouping articles into stories: the distance threshold and running centroids."""

import math

import numpy as np
import pytest

from app.core.config import Settings
from app.services.clustering import cluster_embeddings
from app.services.vectors import add_to_centroid, cosine_similarity, normalize


def _at_distance(distance: float) -> list[float]:
    """A unit vector whose cosine distance from [1, 0] is `distance`."""
    angle = math.acos(1 - distance)
    return [math.cos(angle), math.sin(angle)]


def test_default_threshold_is_the_measured_value():
    # 0.35 came from measuring real headline pairs; 0.25 split same-event stories.
    assert Settings.model_fields["cluster_distance_threshold"].default == 0.35


def test_pair_at_distance_030_groups_with_035_but_not_025():
    vecs = np.array([[1, 0], _at_distance(0.30)], dtype=np.float32)
    strict = cluster_embeddings(vecs, distance_threshold=0.25)
    measured = cluster_embeddings(vecs, distance_threshold=0.35)
    assert strict[0] != strict[1]
    assert measured[0] == measured[1]


def test_unrelated_events_stay_apart():
    vecs = np.eye(3, dtype=np.float32)
    assert len(set(cluster_embeddings(vecs, distance_threshold=0.35))) == 3


def test_no_rows_gives_no_labels():
    assert len(cluster_embeddings(np.empty((0, 3)), 0.35)) == 0


def test_running_centroid_equals_mean_of_all_vectors():
    vectors = [normalize(v) for v in ([1, 0, 0], [0.8, 0.6, 0], [0.6, 0.8, 0], [1, 0, 0.2])]
    centroid = vectors[0]
    for count, vec in enumerate(vectors[1:], start=1):
        centroid = add_to_centroid(centroid, count, vec)
    expected = normalize(np.mean(vectors, axis=0))
    assert cosine_similarity(centroid, expected) == pytest.approx(1, abs=1e-5)


def test_centroid_stays_unit_length():
    centroid = add_to_centroid(normalize([1, 0]), 5, normalize([0, 1]))
    assert float(np.linalg.norm(centroid)) == pytest.approx(1, abs=1e-6)
