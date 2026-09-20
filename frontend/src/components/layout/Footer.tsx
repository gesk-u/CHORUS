import { Logo } from "@/components/ui/Logo"

/** Footer with an audience silhouette and the conductor. */
export function Footer() {
  return (
    <footer className="stage-footer">
      <div className="footer-copy">
        <Logo />
        <p>Many voices. One clearer story.</p>
        <span>Built for curious ears.</span>
      </div>
      <div className="footer-audience" aria-hidden="true">
        {Array.from({ length: 28 }, (_, i) => (
          <i key={i} />
        ))}
      </div>
      <div className="footer-conductor" aria-hidden="true">
        <span />
        <b />
        <i />
        <i />
      </div>
    </footer>
  )
}
