"""Topic assignment and per-topic presentation.

Keyword matching is a placeholder. Once you have labelled stories, swap
`classify_topic` for a scikit-learn classifier trained on article embeddings.
"""

import re
from typing import get_args

from app.schemas.common import StoryArtKind, StoryTopic

DEFAULT_TOPIC: StoryTopic = "Startups"

_KEYWORDS: dict[StoryTopic, tuple[str, ...]] = {
    "AI": ("ai", "artificial intelligence", "llm", "llms", "language model", "openai",
           "anthropic", "gpt", "neural", "machine learning", "chatbot", "chatbots",
           "open model", "open models", "open-weight"),
    "Climate": ("climate", "energy", "carbon", "solar", "battery", "batteries", "grid",
                "emission", "emissions", "renewable", "renewables", "electric vehicle",
                "data center", "data centers"),
    "Security": ("security", "hack", "hacked", "hackers", "breach", "breaches", "password",
                 "passwords", "passkey", "passkeys", "malware", "ransomware", "vulnerability",
                 "vulnerabilities", "privacy", "encryption", "spyware"),
    "Science": ("space", "satellite", "satellites", "nasa", "physics", "quantum", "research",
                "scientist", "scientists", "rocket", "biology", "telescope"),
    "Startups": ("startup", "startups", "funding", "raises", "series a", "series b", "venture",
                 "ipo", "founder", "acquires", "acquisition", "valuation"),
}

# Whole-word matches only, so "ai" doesn't match "aid" or "air".
_PATTERNS = {
    topic: [re.compile(r"\b" + re.escape(word) + r"\b") for word in words]
    for topic, words in _KEYWORDS.items()
}

# Colors and art match the frontend design (src/data/stories.ts).
TOPIC_STYLE: dict[StoryTopic, tuple[str, StoryArtKind]] = {
    "AI": ("#f4d932", "robot"),
    "Climate": ("#83c89b", "battery"),
    "Security": ("#ef92aa", "key"),
    "Science": ("#86b9ee", "satellite"),
    "Startups": ("#bb91d4", "phone"),
}

assert set(TOPIC_STYLE) == set(get_args(StoryTopic)), "every topic needs a style"


def classify_topic(text: str) -> StoryTopic:
    lowered = text.lower()
    scores = {
        topic: sum(len(p.findall(lowered)) for p in patterns)
        for topic, patterns in _PATTERNS.items()
    }
    best = max(scores, key=lambda t: scores[t])
    return best if scores[best] > 0 else DEFAULT_TOPIC


def topic_style(topic: str) -> tuple[str, StoryArtKind]:
    return TOPIC_STYLE.get(topic, TOPIC_STYLE[DEFAULT_TOPIC])  # type: ignore[arg-type]
