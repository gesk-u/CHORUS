"use client"

import { useState } from "react"
import { StoryDrawer } from "@/components/drawer/StoryDrawer"
import { Headliner } from "@/components/home/Headliner"
import { HelloRow } from "@/components/home/HelloRow"
import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"
import { NewsTicker } from "@/components/layout/NewsTicker"
import { SideCurtains } from "@/components/layout/SideCurtains"
import { SvgFilters } from "@/components/ui/SvgFilters"
import { initiallyMuted } from "@/data/voices"
import { useToggleList } from "@/hooks/useToggleList"
import type { Feed, Story } from "@/types/news"

type Props = {
  feed: Feed
}

/**
 * Owns the page's interactive state (saved stories, muted outlets, open
 * drawer) and passes it down. Every visual piece lives in its own file.
 */
export function ChorusApp({ feed }: Props) {
  const { stories } = feed
  const [query, setQuery] = useState("")
  const [live, setLive] = useState(true)
  const [selected, setSelected] = useState<Story | null>(null)
  const saved = useToggleList<number>()
  const muted = useToggleList<number>(initiallyMuted)

  const headliner = stories[0]

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
      </main>

      <Footer />

      {selected && (
        <StoryDrawer story={selected} muted={muted.items} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
