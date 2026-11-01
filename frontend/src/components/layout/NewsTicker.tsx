import { Fragment } from "react"
import { tickerHeadlines } from "@/data/stories"

const notes = ["♪", "♫", "♪"]

/** Scrolling "NOW SINGING" headline strip. */
export function NewsTicker() {
  // One "half" repeats the headlines enough to be wider than any screen; the
  // track holds two identical halves so the translateX(-50%) loop is seamless.
  const half = Array.from({ length: 4 }, () => tickerHeadlines).flat()
  const loop = [...half, ...half]
  return (
    <div className="news-ticker">
      <div className="ticker-label">
        <span>●</span> NOW SINGING
      </div>
      <div className="ticker-window">
        <div className="ticker-track">
          {loop.map((headline, i) => (
            <Fragment key={i}>
              <span>{headline}</span>
              <i>{notes[i % notes.length]}</i>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
