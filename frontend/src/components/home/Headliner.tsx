import { ChoirStage } from "@/components/choir-stage/ChoirStage"
import { DoodleIcon } from "@/components/ui/DoodleIcon"
import { voiceCount } from "@/lib/story"
import { formatAgo } from "@/lib/time"
import type { Story } from "@/types/news"

type Props = {
  story: Story
  muted: number[]
  saved: boolean
  onSave: () => void
  onOpen: () => void
}

/** Today's biggest story, with the interactive choir stage beside it. */
export function Headliner({ story, muted, saved, onSave, onOpen }: Props) {
  const voices = voiceCount(story, muted)

  return (
    <section className="headliner paper-panel">
      <div className="headliner-copy">
        <span className="cutout-label">TODAY’S HEADLINER!</span>
        <p className="kicker">
          {voices} OUTLETS • {formatAgo(story.time).toUpperCase()} • {story.topic}
        </p>
        <h2>{story.title}</h2>
        <p>
          One story. {voices} headlines. We gathered every version so you can hear where
          the voices agree—and where they don’t.
        </p>
        <div className="headliner-stats">
          <span>
            <b>{voices}</b> voices
          </span>
          <span>
            <b>{story.inTune}%</b> in tune
          </span>
          <span>
            <b>6 min</b> read
          </span>
        </div>
        <div className="headliner-actions">
          <button className="primary-button" onClick={onOpen}>
            Hear every version <DoodleIcon name="arrow" />
          </button>
          <button
            className={`round-button ${saved ? "saved" : ""}`}
            onClick={onSave}
            aria-label="Save story"
          >
            <DoodleIcon name="bookmark" />
          </button>
        </div>
      </div>
      <ChoirStage story={story} onOpen={onOpen} muted={muted} voiceTotal={voices} />
    </section>
  )
}
