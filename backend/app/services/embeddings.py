"""Text → embedding vector, using a local sentence-transformers model.

Requires the `ml` extra:  uv sync --extra ml
The model downloads on first use (~90 MB) and is cached afterwards.
"""

from functools import lru_cache

import numpy as np

from app.core.config import get_settings


@lru_cache
def _model():
    try:
        from sentence_transformers import SentenceTransformer
    except ImportError as exc:
        raise RuntimeError(
            "sentence-transformers is not installed. Run: uv sync --extra ml"
        ) from exc
    return SentenceTransformer(get_settings().embedding_model)


def article_text(title: str, summary: str | None) -> str:
    return f"{title}. {summary}" if summary else title


def embed_texts(texts: list[str]) -> np.ndarray:
    """Returns one L2-normalized vector per text, shape (len(texts), EMBEDDING_DIM)."""
    if not texts:
        return np.empty((0, 0), dtype=np.float32)
    return _model().encode(texts, normalize_embeddings=True, convert_to_numpy=True)
