import { voices } from "@/data/voices"
import { ink } from "@/lib/theme"

/** Three head silhouettes, picked by outlet index. */
const headShapes = [
  "M11 36C8 17 17 7 32 6c18-1 27 13 23 32-3 17-14 24-28 22C17 59 13 50 11 36Z",
  "M9 39c0-17 4-29 14-34 8 10 12 10 21 0 9 6 13 18 11 34-2 15-12 22-25 22C17 61 10 53 9 39Z",
  "M8 35C8 20 15 9 28 8c3-7 9-7 11 0 12 2 18 12 16 28-2 16-12 24-25 23C16 59 8 51 8 35Z",
]

type Props = {
  /** Outlet index into `voices`. */
  index: number
  small?: boolean
  muted?: boolean
}

/** A singing character that represents one news outlet. */
export function Singer({ index, small = false, muted = false }: Props) {
  const voice = voices[index % voices.length]
  const odd = index % 2
  const className = ["singer", small && "singer--small", muted && "singer--muted"]
    .filter(Boolean)
    .join(" ")

  return (
    <svg className={className} viewBox="0 0 64 78" role="img" aria-label={voice.name}>
      <title>{voice.name}</title>
      <path d={headShapes[index % 3]} fill={voice.color} />
      <path
        className="singer-robe"
        d="M17 57c8-3 21-3 29 0l7 21H10l7-21Z"
        fill={odd ? "#fff7d9" : "#dcd2f2"}
      />
      <ellipse cx="23" cy="31" rx="6.5" ry="8" fill="#fffdf1" />
      <ellipse cx="42" cy="30" rx="6.5" ry="8" fill="#fffdf1" />
      <circle cx={22 + odd} cy="31" r="2.3" fill={ink} />
      <circle cx={41 + odd} cy="30" r="2.3" fill={ink} />
      <ellipse className="sing-mouth" cx="33" cy="46" rx="7" ry="5.5" fill={ink} />
      <path
        d={odd ? "M15 15 10 5M27 9l1-8M45 11l6-8" : "M18 11c3-7 6-8 8-1M39 10c2-7 5-7 7-1"}
        fill="none"
      />
      {muted && <path className="mute-tape" d="m17 40 31 12M47 39 18 53" />}
    </svg>
  )
}
