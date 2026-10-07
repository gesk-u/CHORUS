import { Singer } from "@/components/ui/Singer"
import { voices } from "@/data/voices"
import { pluralize, voiceCount } from "@/lib/story"
import type { Story } from "@/types/news"

type Props = {
  stories: Story[]
  muted: number[]
  onToggleMuted: (outlet: number) => void
  onUnmuteAll: () => void
}

/** Grid of outlets the reader can mute ("hush") or unmute. */
export function VoicesCard({ stories, muted, onToggleMuted, onUnmuteAll }: Props) {
  const quietedStories = stories.filter((s) => s.outlets.some((o) => muted.includes(o))).length
  const silencedStories = stories.filter((s) => voiceCount(s, muted) === 0).length

  return (
    <section className="voices-card rough-card">
      <div className="card-label">YOUR VOICES</div>
      <div className="voices-head">
        <h3>
          {voices.length - muted.length} of {voices.length} singing
        </h3>
        <span>tap a singer to hush</span>
      </div>
      <div className="voices-grid">
        {voices.map((voice, i) => {
          const isMuted = muted.includes(i)
          const storyCount = stories.filter((s) => s.outlets.includes(i)).length
          return (
            <button
              key={voice.name}
              className={`voice-chip ${isMuted ? "is-muted" : ""}`}
              onClick={() => onToggleMuted(i)}
              aria-label={`${isMuted ? "Unmute" : "Mute"} ${voice.name}`}
              aria-pressed={isMuted}
            >
              <Singer index={i} small muted={isMuted} />
              <strong>{voice.name}</strong>
              <small>
                {isMuted ? "hushed" : `${storyCount} ${pluralize(storyCount, "story", "stories")}`}
              </small>
            </button>
          )
        })}
      </div>
      <div className="voices-summary" aria-live="polite">
        {muted.length ? (
          <>
            <p>
              <b>Hushed:</b>{" "}
              {[...muted]
                .sort((a, b) => a - b)
                .map((outlet) => voices[outlet].name)
                .join(", ")}
            </p>
            <p>
              Their versions are left out of {quietedStories}{" "}
              {pluralize(quietedStories, "story", "stories")}
              {silencedStories ? `, and ${silencedStories} disappeared completely` : ""}.
            </p>
            <button onClick={onUnmuteAll}>unmute everyone</button>
          </>
        ) : (
          <p>Every voice is in your mix. Tap a singer to leave its articles out of your feed.</p>
        )}
      </div>
    </section>
  )
}
