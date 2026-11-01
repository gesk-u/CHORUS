"""Keyword topic classifier: whole words, plurals, ties and the fallback topic."""

from typing import get_args

import pytest

from app.schemas.common import StoryTopic
from app.services.topics import DEFAULT_TOPIC, TOPIC_STYLE, classify_topic, topic_style


@pytest.mark.parametrize(
    ("text", "topic"),
    [
        ("Hackers breach a hospital network", "Security"),
        ("Cheaper batteries keep the grid stable", "Climate"),
        ("Chatbots are replacing call centers", "AI"),
        ("Scientists spot water on a distant moon", "Science"),
    ],
)
def test_plural_keywords_match(text, topic):
    assert classify_topic(text) == topic


@pytest.mark.parametrize(
    "text",
    [
        "Disaster aid arrives by air",  # "ai" inside "aid" and "air"
        "City gridlock gets worse",  # "grid" inside "gridlock"
        "Brainstorming the spacebar",  # "space" inside "spacebar"
    ],
)
def test_keywords_inside_other_words_do_not_match(text):
    assert classify_topic(text) == DEFAULT_TOPIC


def test_matching_ignores_case():
    assert classify_topic("NASA LAUNCHES A NEW TELESCOPE") == "Science"


def test_multi_word_keywords_match():
    assert classify_topic("A new machine learning chip") == "AI"


def test_topic_with_most_keyword_hits_wins():
    # One AI keyword against three startup keywords.
    assert classify_topic("AI startup raises funding") == "Startups"


def test_no_keywords_falls_back_to_default():
    assert classify_topic("A quiet day in the newsroom") == DEFAULT_TOPIC


def test_every_topic_has_a_style():
    assert set(TOPIC_STYLE) == set(get_args(StoryTopic))


def test_unknown_topic_gets_the_default_style():
    assert topic_style("Gardening") == TOPIC_STYLE[DEFAULT_TOPIC]
