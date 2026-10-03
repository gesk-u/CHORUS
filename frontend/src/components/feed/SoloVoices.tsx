import type { CSSProperties } from "react"
import { Singer } from "@/components/ui/Singer"
import { voices } from "@/data/voices"
import type { SoloStory } from "@/types/news"

type Props = {
  solos: SoloStory[]
}

/** Stories only one outlet covered. */
export function SoloVoices({ solos }: Props) {
  return (
    <section className="solo-section">
      <div className="solo-heading">
        <div className="spotlight-doodle">☼</div>
        <div>
          <p className="scribble-note">one outlet, one odd little scoop</p>
          <h2>SOLO VOICES</h2>
        </div>
      </div>
      <div className="solo-cards">
        {solos.length ? (
          solos.map((solo) => (
            <button
              key={solo.outlet}
              className="solo-card"
              style={{ "--solo": solo.color } as CSSProperties}
            >
              <Singer index={solo.outlet} />
              <span>
                <small>{voices[solo.outlet].name} sings alone</small>
                <b>{solo.title}</b>
                <i>read the solo →</i>
              </span>
            </button>
          ))
        ) : (
          <p className="solo-empty">Today’s solo voices are all hushed.</p>
        )}
      </div>
    </section>
  )
}
