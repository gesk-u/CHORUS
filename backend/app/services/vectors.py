"""Small vector helpers. Pure numpy, no database."""

import numpy as np
from numpy.typing import ArrayLike, NDArray

Vec = NDArray[np.float32]


def normalize(v: ArrayLike) -> Vec:
    arr = np.asarray(v, dtype=np.float32)
    norm = float(np.linalg.norm(arr))
    return arr if norm == 0 else arr / norm


def cosine_similarity(a: ArrayLike, b: ArrayLike) -> float:
    return float(np.dot(normalize(a), normalize(b)))


def add_to_centroid(centroid: ArrayLike, count: int, new: ArrayLike) -> Vec:
    """Centroid after adding one more vector to a cluster of `count` vectors."""
    c = np.asarray(centroid, dtype=np.float32)
    n = np.asarray(new, dtype=np.float32)
    return normalize((c * count + n) / (count + 1))
