type Props = {
  name: string
  headline: string
  hushed: boolean
  hidden: boolean
}

/** Shows what the selected singer (outlet) is saying. */
export function SpeechBubble({ name, headline, hushed, hidden }: Props) {
  return (
    <div className="speech-bubble" aria-live="polite" aria-hidden={hidden}>
      <b>
        {name} {hushed ? "IS HUSHED" : "SINGS:"}
      </b>
      <span>
        {hushed ? "You muted this outlet, so its version is left out." : `“${headline}”`}
      </span>
    </div>
  )
}
