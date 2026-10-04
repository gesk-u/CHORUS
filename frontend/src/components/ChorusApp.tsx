"use client"

import { useMemo, useState } from "react"
import { StoryDrawer } from "@/components/drawer/StoryDrawer"
import { Setlist } from "@/components/feed/Setlist"
import { SoloVoices } from "@/components/feed/SoloVoices"
import { TopicTabs } from "@/components/feed/TopicTabs"
import { Headliner } from "@/components/home/Headliner"
import { HelloRow } from "@/components/home/HelloRow"
import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"
import { NewsTicker } from "@/components/layout/NewsTicker"
import { SideCurtains } from "@/components/layout/SideCurtains"
import { SvgFilters } from "@/components/ui/SvgFilters"
import { initiallyMuted } from "@/data/voices"
import { useToggleList } from "@/hooks/useToggleList"
import { voiceCount } from "@/lib/story"
import type { Feed, Sort, Story, Topic } from "@/types/news"

type Props = {
  feed: Feed
}

/**
 * Owns the page's interactive state (filters, saved stories, muted outlets,
 * open drawer) and passes it down. Every visual piece lives in its own file.
 */
export function ChorusApp({ feed }: Props) {
  const { stories, soloStories } = feed
  const [topic, setTopic] = useState<Topic>("All noise")
  const [sort, setSort] = useState<Sort>("For me")
  const [query, setQuery] = useState("")
  const [live, setLive] = useState(true)
  const [selected, setSelected] = useState<Story | null>(null)
  const saved = useToggleList<number>()
  const muted = useToggleList<number>(initiallyMuted)

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    const result = stories.filter(
      (story) =>
        (topic === "All noise" || story.topic === topic) &&
        `${story.title} ${story.deck}`.toLowerCase().includes(q) &&
        voiceCount(story, muted.items) > 0,
    )
    return result.sort((a, b) => {
      if (sort === "Loudest") return voiceCount(b, muted.items) - voiceCount(a, muted.items)
      if (sort === "Freshest") return a.time - b.time
      return a.id - b.id
    })
  }, [stories, topic, query, sort, muted.items])

  const headliner = stories[0]
  const visibleSolos = soloStories.filter((solo) => !muted.items.includes(solo.outlet))

  const resetFilters = () => {
    setTopic("All noise")
    setQuery("")
  }

  return (
    <div className={`chorus-app ${live ? "is-live" : "is-paused"}`}>
      <SvgFilters />
      <Header
        savedCount={saved.items.length}
        query={query}
        onQueryChange={setQuery}
        live={live}
        onToggleLive={() => setLive(!live)}
      />
      <NewsTicker />
      <SideCurtains />

      <main className="page">
        <HelloRow name="Ana" voicesHeard={148} storiesTuned={31} echoesHushed={117} freshStories={12} />

        {headliner && (
          <Headliner
            story={headliner}
            muted={muted.items}
            saved={saved.items.includes(headliner.id)}
            onSave={() => saved.toggle(headliner.id)}
            onOpen={() => setSelected(headliner)}
          />
        )}

        <TopicTabs active={topic} onChange={setTopic} />

        <div className="content-grid">
          <section className="setlist">
            <Setlist
              stories={filtered}
              muted={muted.items}
              saved={saved.items}
              sort={sort}
              onSortChange={setSort}
              onToggleSave={saved.toggle}
              onOpen={setSelected}
              onReset={resetFilters}
            />
            <SoloVoices solos={visibleSolos} />
          </section>
        </div>
      </main>

      <Footer />

      {selected && (
        <StoryDrawer story={selected} muted={muted.items} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
