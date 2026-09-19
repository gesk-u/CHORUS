import type { CSSProperties } from "react"

const letter = (char: string, i: number) => (
  <span key={char} style={{ "--i": i } as CSSProperties}>
    {char}
  </span>
)

/** "CHORUS" wordmark where the O is a singing mouth. */
export function Logo() {
  return (
    <a className="logo" href="#" aria-label="Chorus home">
      {"CH".split("").map((char, i) => letter(char, i))}
      <span className="logo-mouth" aria-hidden="true">
        <i />
      </span>
      {"RUS".split("").map((char, i) => letter(char, i + 3))}
    </a>
  )
}
