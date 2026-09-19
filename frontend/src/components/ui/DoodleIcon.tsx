import type { ReactNode } from "react"
import { paper } from "@/lib/theme"

export type DoodleIconName =
  | "search"
  | "bookmark"
  | "play"
  | "pause"
  | "arrow"
  | "close"
  | "sound"
  | "spark"
  | "tune"

const paths: Record<DoodleIconName, ReactNode> = {
  search: (
    <>
      <path d="M5 11c.3-4 2.5-6.4 6.1-6.2 3.8.1 6.2 2.7 5.9 6.4-.2 3.6-2.7 5.9-6.4 5.7C7 16.7 4.7 14.5 5 11Z" />
      <path d="m16 16 5 5" />
    </>
  ),
  bookmark: <path d="M6.4 3.6c3.7-.7 7.5-.4 11.2.1l-.3 17-5.4-3.8-5.7 4.2.2-17.5Z" />,
  play: <path d="m8 5.1 11 6.5-11.2 7.1L8 5.1Z" />,
  pause: (
    <>
      <path d="M8 5v14" />
      <path d="M16 5v14" />
    </>
  ),
  arrow: (
    <>
      <path d="M4 12c5-.5 10.5.2 16-.2" />
      <path d="m15.5 6 5 5.7-5.3 5.7" />
    </>
  ),
  close: (
    <>
      <path d="M5 5c4.4 4.9 9.5 9.3 14 14" />
      <path d="M19 5C14.3 9.5 9.2 14.5 5 19" />
    </>
  ),
  sound: (
    <>
      <path d="M4 10h4l5-4v12l-5-4H4v-4Z" />
      <path d="M16 9c1.8 1.8 1.8 4.2 0 6M19 6c4 3.4 4 8.4.2 12" />
    </>
  ),
  spark: <path d="m12 2 1.6 6.1 6.2 2-6 2L12 19l-2-6.3L4 11l6.1-2.4L12 2Z" />,
  tune: (
    <>
      <path d="M4 7h16M4 17h16" />
      <circle cx="9" cy="7" r="2.2" fill={paper} />
      <circle cx="15" cy="17" r="2.2" fill={paper} />
    </>
  ),
}

type Props = {
  name: DoodleIconName
  size?: number
}

/** Hand-drawn style line icon. */
export function DoodleIcon({ name, size = 22 }: Props) {
  return (
    <svg
      className="doodle-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {paths[name]}
      </g>
    </svg>
  )
}
