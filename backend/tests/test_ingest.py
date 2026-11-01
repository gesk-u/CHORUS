"""Feed parsing: RSS and Atom dates, HTML cleanup and entries we skip."""

from datetime import UTC, datetime, timedelta

from app.services.ingest import clean_html, parse_feed

RSS = b"""<?xml version="1.0"?><rss version="2.0"><channel><title>x</title>
  <item><title>Chip &amp; <b>model</b> news</title><link>https://example.com/rss</link>
    <description>&lt;p&gt;First&lt;/p&gt;   &lt;p&gt;second&lt;/p&gt;</description>
    <pubDate>Sun, 18 Oct 2026 09:30:00 GMT</pubDate></item>
  <item><title>No link here</title></item>
  <item><link>https://example.com/no-title</link></item>
</channel></rss>"""

# The Verge's feed is Atom with <updated> and no <published>.
ATOM = b"""<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom"><title>x</title>
  <entry><title>Atom story</title><link href="https://example.com/atom"/>
    <updated>2026-10-18T07:15:00Z</updated><summary>Short</summary></entry>
</feed>"""

UNDATED = b"""<?xml version="1.0"?><rss version="2.0"><channel><title>x</title>
  <item><title>Undated</title><link>https://example.com/undated</link></item>
</channel></rss>"""


def test_rss_entry_uses_pub_date():
    [entry] = parse_feed(RSS)
    assert entry.url == "https://example.com/rss"
    assert entry.published_at == datetime(2026, 10, 18, 9, 30, tzinfo=UTC)


def test_atom_entry_falls_back_to_updated():
    [entry] = parse_feed(ATOM)
    assert entry.published_at == datetime(2026, 10, 18, 7, 15, tzinfo=UTC)


def test_entry_without_any_date_is_stamped_now():
    [entry] = parse_feed(UNDATED)
    assert datetime.now(UTC) - entry.published_at < timedelta(minutes=1)


def test_entries_without_link_or_title_are_skipped():
    assert [e.url for e in parse_feed(RSS)] == ["https://example.com/rss"]


def test_title_and_summary_are_plain_text():
    [entry] = parse_feed(RSS)
    assert entry.title == "Chip & model news"
    assert entry.summary == "First second"


def test_clean_html_collapses_whitespace_and_truncates():
    assert clean_html("  a \n\n  b\t c ") == "a b c"
    assert clean_html("x" * 50, limit=10) == "x" * 10
    assert clean_html("") is None
    assert clean_html("<br/>") is None
