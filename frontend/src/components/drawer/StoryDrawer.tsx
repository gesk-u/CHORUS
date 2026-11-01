import { useEffect } from "react"
import { DoodleIcon } from "@/components/ui/DoodleIcon"
import { voiceCount } from "@/lib/story"
import { formatAgo } from "@/lib/time"
import type { Story } from "@/types/news"
import { VoiceVersion } from "./VoiceVersion"

type Props = {
  story: Story
  muted: number[]
  onClose: () => void
}

/** Side panel comparing how each outlet covered the same story. */
export function StoryDrawer({ story, muted, onClose }: Props) {
  // A modal dialog should close with Escape, like the close button and backdrop.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [onClose])

  const isHushed = (outlet: number | null) => outlet !== null && muted.includes(outlet)
  const singing = story.versions.filter((v) => !isHushed(v.outlet))
  const hushed = story.versions.filter((v) => isHushed(v.outlet))

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
          {voiceCount(story, muted)} OUTLETS • {formatAgo(story.time).toUpperCase()} •{" "}
          {story.inTune}% IN TUNE
        </p>
        <h2 id="drawer-title">{story.title}</h2>
        <p className="drawer-deck">{story.deck}</p>
        <div className="drawer-choir">
          {singing.map((version) => (
            <VoiceVersion key={`${version.outletName}-${version.url}`} version={version} />
          ))}
        </div>
        {hushed.length > 0 && (
          <p className="drawer-hushed">
            Hushed by you: {hushed.map((v) => v.outletName).join(", ")}
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
