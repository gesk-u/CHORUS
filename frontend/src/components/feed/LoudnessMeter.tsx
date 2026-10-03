const BARS = 5

type Props = {
  /** Number of outlets covering the story. One bar lights per 3 voices. */
  count: number
}

/** Small bar meter showing how many voices cover a story. */
export function LoudnessMeter({ count }: Props) {
  const lit = Math.ceil(count / 3)
  return (
    <div className="loudness">
      <small>{count} voices</small>
      <span>
        {Array.from({ length: BARS }, (_, i) => (
          <i key={i} className={i < lit ? "is-on" : ""} style={{ height: 5 + i * 4 }} />
        ))}
      </span>
    </div>
  )
}
