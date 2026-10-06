import { trends } from "@/data/sidebar"

/** Topics whose coverage is growing fastest. */
export function Crescendo() {
  return (
    <section className="crescendo rough-card">
      <div className="card-label">CRESCENDO ↗</div>
      <h3>Getting louder, fast</h3>
      {trends.map(({ label, change }, i) => (
        <div className="trend" key={label}>
          <b>0{i + 1}</b>
          <span>
            {label}
            <small>{change} louder</small>
          </span>
          <i style={{ width: `${92 - i * 18}%` }} />
        </div>
      ))}
    </section>
  )
}
