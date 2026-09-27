const FOLDS_OPEN =
  "M26 0C29 78 25 154 20 214C25 286 29 346 29 400M52 0C54 78 48 154 40 213C50 286 56 346 58 400M78 0C77 74 69 150 56 212C70 276 78 340 80 400"
const FOLDS_CLOSED =
  "M20 0C22 120 18 260 21 400M42 0C40 130 45 270 42 400M64 0C66 120 61 260 64 400M86 0C84 130 88 270 85 400"

type Props = {
  side: "left" | "right"
  closed: boolean
  onToggle: () => void
}

/** One stage curtain. Both states are drawn; CSS cross-fades between them. */
export function Curtain({ side, closed, onToggle }: Props) {
  const label = closed ? "Open the curtains" : "Close the curtains"
  return (
    <button
      type="button"
      className={`stage-curtain stage-curtain--${side}`}
      onClick={onToggle}
      aria-label={label}
      aria-pressed={closed}
    >
      <svg viewBox="0 0 100 400" preserveAspectRatio="none" aria-hidden="true">
        <g className="curtain-open">
          <path className="curtain-fill" d="M0 0H100C96 72 86 150 68 212C88 268 97 336 99 400H0Z" />
          <path className="curtain-shade" d={FOLDS_OPEN} />
          <path className="curtain-fold" d={FOLDS_OPEN} />
          <path className="curtain-edge" d="M100 0C96 72 86 150 68 212C88 268 97 336 99 400" />
          <path className="curtain-tie" d="M0 199C26 192 52 197 75 210C53 225 27 230 0 223Z" />
          <path className="curtain-tassel" d="M66 219 70 247M63 247h14" />
        </g>
        <g className="curtain-closed">
          <path
            className="curtain-fill"
            d="M0 0H100C97 90 102 190 99 290C98 340 101 372 100 400H0Z"
          />
          <path className="curtain-shade" d={FOLDS_CLOSED} />
          <path className="curtain-fold" d={FOLDS_CLOSED} />
          <path className="curtain-edge" d="M100 0C97 90 102 190 99 290C98 340 101 372 100 400" />
        </g>
      </svg>
    </button>
  )
}
