import type { CSSProperties } from "react"
import { DoodleIcon } from "@/components/ui/DoodleIcon"
import { Singer } from "@/components/ui/Singer"
import { voices } from "@/data/voices"
import { activeOutlets, voiceCount } from "@/lib/story"
import { formatAgo } from "@/lib/time"
import type { Story } from "@/types/news"
import { LoudnessMeter } from "./LoudnessMeter"
import { StoryArt } from "./StoryArt"

const MAX_MINI_SINGERS = 5

type Props = {
  story: Story
  /** Position in the grid; picks one of four slight card tilts. */
  index: number
  muted: number[]
  saved: boolean
  onSave: () => void
  onOpen: () => void
}

/** A taped-on paper card for one story cluster. */
export function StoryCard({ story, index, muted, saved, onSave, onOpen }: Props) {
  const singing = activeOutlets(story, muted)
  const count = voiceCount(story, muted)
  const shown = singing.slice(0, MAX_MINI_SINGERS)
  const leadOutlet = singing[0]
  const leadName = leadOutlet === undefined ? "other outlets" : voices[leadOutlet].name

  return (
    <article
      className={`story-card story-card--${index % 4}`}
      style={{ "--card-color": story.color } as CSSProperties}
    >
      <span className="tape tape--one" />
      <span className="tape tape--two" />
      <div className="story-card__art">
        <StoryArt kind={story.art} />
        <span className="story-sticker">{story.time < 10 ? "NEW!" : story.topic}</span>
        {leadOutlet !== undefined && (
          <span className="story-lead-singer" aria-hidden="true">
            <Singer index={leadOutlet} />
          </span>
        )}
      </div>
      <div className="story-card__copy">
        <div className="story-meta">
          <span>
            {story.topic} • via {leadName}
          </span>
          <span>{formatAgo(story.time)}</span>
        </div>
        <h3>{story.title}</h3>
        <p>{story.deck}</p>
        <div className="choir-row">
          <div className="mini-singers">
            {shown.map((outlet) => (
              <Singer key={outlet} index={outlet} small />
            ))}
            {count > shown.length && <b>+{count - shown.length}</b>}
          </div>
          <LoudnessMeter count={count} />
        </div>
        <div className="why">
          <span>↳</span> {story.reason}
        </div>
        <div className="story-actions">
          <button onClick={onSave} className={saved ? "saved" : ""}>
            <DoodleIcon name="bookmark" size={18} />
            {saved ? "Encore!" : "Save"}
          </button>
          <button onClick={onOpen}>
            Hear the choir <DoodleIcon name="arrow" size={18} />
          </button>
        </div>
      </div>
    </article>
  )
}
