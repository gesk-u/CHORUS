import { Fragment } from "react"
import { tickerHeadlines } from "@/data/stories"

const notes = ["♪", "♫", "♪"]

/** Scrolling "NOW SINGING" headline strip. */
export function NewsTicker() {
  // The track is rendered twice so the CSS loop (translateX -50%) is seamless.
  const loop = [...tickerHeadlines, ...tickerHeadlines.slice(0, 2)]
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
