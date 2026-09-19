/** Shared SVG filters. `#wobble` gives singers their hand-drawn edge. */
export function SvgFilters() {
  return (
    <svg width="0" height="0" className="svg-filters" aria-hidden="true">
      <filter id="wobble">
        <feTurbulence
          type="fractalNoise"
          baseFrequency=".018 .045"
          numOctaves="2"
          seed="8"
          result="noise"
        />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" />
      </filter>
    </svg>
  )
}
