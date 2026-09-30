import { DoodleIcon } from "@/components/ui/DoodleIcon"
import { alternateHeadlines } from "@/data/stories"
import { voices } from "@/data/voices"
import { activeOutlets, voiceCount } from "@/lib/story"
import type { Story } from "@/types/news"
import { VoiceVersion } from "./VoiceVersion"

const MAX_VERSIONS = 6

type Props = {
  story: Story
  muted: number[]
  onClose: () => void
}

/** Side panel comparing how each outlet covered the same story. */
export function StoryDrawer({ story, muted, onClose }: Props) {
  const singing = activeOutlets(story, muted).slice(0, MAX_VERSIONS)
  const hushed = story.outlets.filter((outlet) => muted.includes(outlet))

  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <aside
        className="story-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="drawer-close" onClick={onClose} aria-label="Close story">
          <DoodleIcon name="close" />
        </button>
        <span className="cutout-label">{story.topic} CHOIR</span>
        <p className="kicker">
          {voiceCount(story, muted)} OUTLETS • {story.time} MIN AGO
        </p>
        <h2 id="drawer-title">{story.title}</h2>
        <p className="drawer-deck">{story.deck}</p>
        <div className="drawer-choir">
          {singing.map((outlet, i) => (
            <VoiceVersion
              key={outlet}
              outlet={outlet}
              headline={i === 0 ? story.title : alternateHeadlines[i - 1]}
              minutesAgo={i * 3 + 2}
              inTune={94 - i * 2}
            />
          ))}
        </div>
        {hushed.length > 0 && (
          <p className="drawer-hushed">
            Hushed by you: {hushed.map((outlet) => voices[outlet].name).join(", ")}
          </p>
        )}
        <div className="drawer-note">
          <DoodleIcon name="spark" />
          <p>
            <b>Why these sing together</b>We grouped them by meaning, not matching words. Their
            embeddings sit in the same little neighborhood.
          </p>
        </div>
      </aside>
    </div>
  )
}
