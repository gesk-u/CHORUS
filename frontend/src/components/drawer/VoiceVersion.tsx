import { DoodleIcon } from "@/components/ui/DoodleIcon"
import { Singer } from "@/components/ui/Singer"
import { voices } from "@/data/voices"

type Props = {
  outlet: number
  headline: string
  minutesAgo: number
  /** How closely this version matches the cluster, in percent. */
  inTune: number
}

/** One outlet's version of a story inside the drawer. */
export function VoiceVersion({ outlet, headline, minutesAgo, inTune }: Props) {
  return (
    <div className="voice-version">
      <Singer index={outlet} small />
      <div>
        <b>{voices[outlet].name}</b>
        <p>{headline}</p>
        <small>
          {minutesAgo} min ago · {inTune}% in tune
        </small>
      </div>
      <button aria-label={`Read ${voices[outlet].name}'s article`}>
        <DoodleIcon name="arrow" />
      </button>
    </div>
  )
}
