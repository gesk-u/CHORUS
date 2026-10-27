import { DoodleIcon } from "@/components/ui/DoodleIcon"
import { Singer } from "@/components/ui/Singer"
import { formatAgo } from "@/lib/time"
import type { StoryVersion } from "@/types/news"

type Props = {
  version: StoryVersion
}

/** One outlet's version of a story inside the drawer, linking to the article. */
export function VoiceVersion({ version }: Props) {
  const { outlet, outletName, title, url, minutesAgo, inTune } = version
  return (
    <div className="voice-version">
      {outlet !== null ? <Singer index={outlet} small /> : <span aria-hidden="true" />}
      <div>
        <b>{outletName}</b>
        <p>{title}</p>
        <small>
          {formatAgo(minutesAgo)} · {inTune}% in tune
        </small>
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`Read on ${outletName}`}>
        <DoodleIcon name="arrow" />
      </a>
    </div>
  )
}
