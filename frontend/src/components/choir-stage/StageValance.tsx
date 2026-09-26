/** Scalloped curtain strip across the top of the stage. */
export function StageValance() {
  return (
    <svg
      className="stage-valance"
      viewBox="0 0 600 70"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        className="valance-fill"
        d="M0 0H600V38Q571 65 540 38Q511 67 480 38Q451 64 420 38Q389 66 360 38Q331 65 300 38Q270 67 240 38Q211 64 180 38Q149 66 120 38Q91 65 60 38Q29 66 0 38Z"
      />
      <path
        className="valance-fold"
        d="M30 9V48M90 9V48M150 9V49M210 9V48M270 9V50M330 9V49M390 9V49M450 9V48M510 9V50M570 9V49"
      />
      <path className="valance-trim" d="M0 0H600V9H0Z" />
      <path
        className="valance-edge"
        d="M0 9H600M0 38Q29 66 60 38Q91 65 120 38Q149 66 180 38Q211 64 240 38Q270 67 300 38Q331 65 360 38Q389 66 420 38Q451 64 480 38Q511 67 540 38Q571 65 600 38"
      />
    </svg>
  )
}
