"use client"

import { useState } from "react"
import { DoodleIcon } from "@/components/ui/DoodleIcon"
import { Singer } from "@/components/ui/Singer"
import { waveformHeights } from "@/data/sidebar"

/** The 90-second audio briefing card. Playback is mocked for now. */
export function ChorusPlayer() {
  const [playing, setPlaying] = useState(false)

  return (
    <section className="chorus-player rough-card">
      <div className="player-top">
        <span>YOUR 90-SECOND CHORUS</span>
        <i>morning mix</i>
      </div>
      <div className="player-character">
        <Singer index={1} />
        <span className="player-note">♪</span>
      </div>
      <h3>
        Six stories.
        <br />
        Zero repeats.
      </h3>
      <div className="waveform" aria-hidden="true">
        {waveformHeights.map((height, i) => (
          <i key={i} style={{ height }} />
        ))}
      </div>
      <div className="player-controls">
        <button
          onClick={() => setPlaying(!playing)}
          aria-label={playing ? "Pause briefing" : "Play briefing"}
        >
          <DoodleIcon name={playing ? "pause" : "play"} />
        </button>
        <span>{playing ? "0:27" : "0:00"} / 1:32</span>
        <DoodleIcon name="sound" />
      </div>
    </section>
  )
}
