import { DoodleIcon } from "@/components/ui/DoodleIcon"
import { Logo } from "@/components/ui/Logo"

type Props = {
  savedCount: number
  query: string
  onQueryChange: (query: string) => void
  live: boolean
  onToggleLive: () => void
}

/** Red theater valance with navigation, search and the ON AIR toggle. */
export function Header({ savedCount, query, onQueryChange, live, onToggleLive }: Props) {
  return (
    <header className="theater-header">
      <div className="header-inner">
        <Logo />
        <nav>
          <button className="active">The stage</button>
          <button>Discover</button>
          <button>
            Encore <b>{savedCount}</b>
          </button>
        </nav>
        <label className="search-box">
          <DoodleIcon name="search" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Hum a story..."
          />
        </label>
        <button className={`on-air ${live ? "active" : ""}`} onClick={onToggleLive}>
          <i />
          <span>{live ? "ON AIR" : "PAUSED"}</span>
          <i />
        </button>
      </div>
      <svg
        className="valance-edge"
        viewBox="0 0 1200 42"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 0h1200v10c-50 30-101 29-150 2-49 28-99 29-150 0-52 30-103 30-151-1-48 29-98 30-149 2-52 28-101 28-150-1-50 30-100 31-151 1C99 40 49 39 0 10V0Z"
          fill="#d9423d"
        />
        <path d="M0 10c49 29 99 30 149 3 51 30 101 29 151-1 49 29 98 29 150 1 51 28 101 27 149-2 48 31 99 31 151 1 51 29 101 28 150 0 49 27 100 28 150-2" />
      </svg>
    </header>
  )
}
