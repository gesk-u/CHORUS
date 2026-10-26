type Props = {
  voiceTotal: number
  /** 0-100: how closely the outlets' versions agree. */
  inTune: number
}

/** Hanging sign: how many newsrooms cover the story and how much they agree. */
export function StageMarquee({ voiceTotal, inTune }: Props) {
  return (
    <div className="stage-marquee">
      <span>{voiceTotal}</span>
      <p>
        <b>NEWSROOMS</b>
        <i>one story, many voices</i>
      </p>
      <strong>
        {inTune}%<small>IN TUNE</small>
      </strong>
    </div>
  )
}
