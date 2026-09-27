type Props = {
  voiceTotal: number
}

/** Hanging sign: how many newsrooms cover the story and how much they agree. */
export function StageMarquee({ voiceTotal }: Props) {
  return (
    <div className="stage-marquee">
      <span>{voiceTotal}</span>
      <p>
        <b>NEWSROOMS</b>
        <i>one story, many voices</i>
      </p>
      <strong>
        93%<small>IN TUNE</small>
      </strong>
    </div>
  )
}
