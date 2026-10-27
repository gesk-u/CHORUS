"use client"

import { useState } from "react"
import { stageSlots } from "@/data/stage"
import type { Story, StoryVersion } from "@/types/news"
import { Curtain } from "./Curtain"
import { SpeechBubble } from "./SpeechBubble"
import { StageMarquee } from "./StageMarquee"
import { StageScene } from "./StageScene"
import { StageValance } from "./StageValance"

/** A version whose outlet has a singer drawn on stage. */
export type StageSinger = StoryVersion & { outlet: number }

type Props = {
  story: Story
  muted: number[]
  voiceTotal: number
  onOpen: () => void
}

/**
 * Interactive stage: every outlet covering the story is a singer. Hover or
 * click a singer to read its headline; click a curtain to close the show.
 */
export function ChoirStage({ story, muted, voiceTotal, onOpen }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [curtainsClosed, setCurtainsClosed] = useState(false)
  const toggleCurtains = () => setCurtainsClosed((closed) => !closed)

  const drawable = story.versions.filter((v): v is StageSinger => v.outlet !== null)
  const singers = drawable.slice(0, stageSlots.length)
  // Outlets with no spot on stage: overflow beyond 12 benches + outlets with no singer.
  const inWings = drawable.length - singers.length + (story.extraVoices ?? 0)
  const active = singers[Math.min(activeIndex, singers.length - 1)]

  return (
    <div
      className={`choir-stage ${curtainsClosed ? "curtains-closed" : ""}`}
      role="group"
      aria-label="Interactive choir of news outlets covering the same story"
    >
      <div className="stage-spotlight" aria-hidden="true" />
      <Curtain side="left" closed={curtainsClosed} onToggle={toggleCurtains} />
      <Curtain side="right" closed={curtainsClosed} onToggle={toggleCurtains} />
      <StageValance />
      <StageMarquee voiceTotal={voiceTotal} inTune={story.inTune} />
      <StageScene
        inert={curtainsClosed}
        singers={singers}
        muted={muted}
        activeIndex={singers.indexOf(active)}
        onSelect={setActiveIndex}
      />
      <div className="music-notes" aria-hidden="true">
        <span>♪</span>
        <span>♫</span>
        <span>♪</span>
      </div>
      {active && (
        <SpeechBubble
          name={active.outletName}
          headline={active.title}
          hushed={muted.includes(active.outlet)}
          hidden={curtainsClosed}
        />
      )}
      <div className="stage-intermission" aria-live="polite">
        {curtainsClosed && (
          <>
            <b>INTERMISSION</b>
            <span>tap a curtain to bring the choir back</span>
          </>
        )}
      </div>
      <div className="audience" aria-hidden="true">
        {Array.from({ length: 13 }, (_, i) => (
          <i key={i} />
        ))}
      </div>
      <span className="stage-hint">
        {curtainsClosed ? (
          "the choir is taking a breath"
        ) : (
          <>
            pick a singer ↑{inWings > 0 && <small> · {inWings} more in the wings</small>}
          </>
        )}
      </span>
      <button className="stage-open" onClick={onOpen}>
        compare all voices <span>→</span>
      </button>
    </div>
  )
}
