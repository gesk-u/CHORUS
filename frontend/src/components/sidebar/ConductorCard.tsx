import { DoodleIcon } from "@/components/ui/DoodleIcon"
import { tasteScores } from "@/data/sidebar"
import { ink, paper } from "@/lib/theme"

/** Shows what the recommender has learned about the reader's interests. */
export function ConductorCard() {
  return (
    <section className="conductor-card rough-card">
      <div className="card-label">THE CONDUCTOR</div>
      <Maestro />
      <h3>I’m learning your rhythm.</h3>
      <p>Every read, skip and encore helps me tune tomorrow’s show.</p>
      {tasteScores.map(({ label, value, color }) => (
        <div className="taste-row" key={label}>
          <span>{label}</span>
          <b>{value}%</b>
          <div>
            <i style={{ width: `${value}%`, background: color }} />
          </div>
        </div>
      ))}
      <button className="tune-button">
        <DoodleIcon name="tune" /> Tune my conductor
      </button>
    </section>
  )
}

function Maestro() {
  return (
    <div className="maestro">
      <svg viewBox="0 0 170 125" aria-hidden="true">
        <path
          d="M55 46c-1-23 12-37 32-37 23 0 35 17 31 41-3 20-17 31-35 29-18-1-27-13-28-33Z"
          fill="#f4d932"
        />
        <path d="M59 26c-15 1-19-12-10-18M67 16c-9-8-4-18 5-16M82 11c-2-11 10-16 16-7M100 15c8-10 18-5 16 4M113 27c14-2 17 10 10 18" />
        <circle cx="76" cy="43" r="10" fill={paper} />
        <circle cx="101" cy="42" r="10" fill={paper} />
        <circle cx="78" cy="43" r="3" fill={ink} />
        <circle cx="99" cy="42" r="3" fill={ink} />
        <path d="M76 62c8 6 17 5 24-1M70 84c11-7 28-7 38 0l10 40H57l13-40Z" fill={paper} />
        <path className="maestro-arm" d="m68 92-37-23L17 42M107 91l31-28 12-30" />
        <path d="m150 33 7-24" />
        <path d="m84 87 7 7 8-7" fill="#ef5b47" />
      </svg>
    </div>
  )
}
