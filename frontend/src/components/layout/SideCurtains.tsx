/** Decorative curtains on both edges of very wide screens. */
export function SideCurtains() {
  return (
    <>
      {(["left", "right"] as const).map((side) => (
        <aside key={side} className={`side-curtain side-curtain--${side}`} aria-hidden="true">
          <span />
          <span />
          <span />
        </aside>
      ))}
    </>
  )
}
