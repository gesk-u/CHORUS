"use client"

import { useState } from "react"
import { stageVoices } from "@/data/stage"
import { Curtain } from "./Curtain"
import { SpeechBubble } from "./SpeechBubble"
import { StageMarquee } from "./StageMarquee"
import { StageScene } from "./StageScene"
import { StageValance } from "./StageValance"

type Props = {
  onOpen: () => void
  muted: number[]
  voiceTotal: number
}

/**
 * Interactive stage: each outlet is a singer. Hover/click a singer to read its
 * headline; click a curtain to close the show.
 */
export function ChoirStage({ onOpen, muted, voiceTotal }: Props) {
  const [activeVoice, setActiveVoice] = useState(1)
  const [curtainsClosed, setCurtainsClosed] = useState(false)
  const toggleCurtains = () => setCurtainsClosed((closed) => !closed)
  const [activeName, activeHeadline] = stageVoices[activeVoice]

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
      <StageMarquee voiceTotal={voiceTotal} />
      <StageScene
        inert={curtainsClosed}
        muted={muted}
        activeVoice={activeVoice}
        onSelectVoice={setActiveVoice}
      />
      <div className="music-notes" aria-hidden="true">
        <span>♪</span>
        <span>♫</span>
        <span>♪</span>
      </div>
      <SpeechBubble
        name={activeName}
        headline={activeHeadline}
        hushed={muted.includes(activeVoice)}
        hidden={curtainsClosed}
      />
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
            pick a singer ↑<small> · 3 more in the wings</small>
          </>
        )}
      </span>
      <button className="stage-open" onClick={onOpen}>
        compare all voices <span>→</span>
      </button>
    </div>
  )
}
