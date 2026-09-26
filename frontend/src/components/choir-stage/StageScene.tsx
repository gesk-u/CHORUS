import { Singer } from "@/components/ui/Singer"
import { SCENE_HEIGHT, SCENE_WIDTH, stagePositions, stageVoices } from "@/data/stage"

const SINGER_WIDTH = 56
const SINGER_HEIGHT = (SINGER_WIDTH * 78) / 64

type Props = {
  inert: boolean
  muted: number[]
  activeVoice: number
  onSelectVoice: (index: number) => void
}

/** Benches, the singers standing on them, and the conductor in front. */
export function StageScene({ inert, muted, activeVoice, onSelectVoice }: Props) {
  return (
    <div className="stage-scene" inert={inert}>
      <Benches />
      <div className="choir-people">
        {stagePositions.map(([x, feet, index]) => {
          const name = stageVoices[index][0]
          const isMuted = muted.includes(index)
          return (
            <button
              key={index}
              className={`choir-person ${activeVoice === index ? "is-active" : ""}`}
              style={{
                left: `${(x / SCENE_WIDTH) * 100}%`,
                top: `${((feet - SINGER_HEIGHT) / SCENE_HEIGHT) * 100}%`,
                width: `${(SINGER_WIDTH / SCENE_WIDTH) * 100}%`,
                zIndex: feet,
              }}
              onClick={() => onSelectVoice(index)}
              onMouseEnter={() => onSelectVoice(index)}
              aria-label={isMuted ? `${name} is hushed` : `Hear ${name}'s version`}
              aria-pressed={activeVoice === index}
            >
              <Singer index={index} muted={isMuted} />
              <span>{name}</span>
            </button>
          )
        })}
      </div>
      <Conductor />
    </div>
  )
}

function Benches() {
  return (
    <svg className="stage-benches" viewBox="0 0 520 330" aria-hidden="true">
      <path className="bench-shadow" d="M70 298c120 9 260 9 380 0" />
      <path className="bench-top" d="M139 137c78-3 164-3 244 0l7 9H132l7-9Z" />
      <path className="bench-face" d="M132 146h258l-2 21H134l-2-21Z" />
      <path className="bench-grain" d="M148 157c72 3 152 3 224 0" />
      <path className="bench-top" d="M109 199c100-3 202-3 302 0l8 9H101l8-9Z" />
      <path className="bench-face" d="M101 208h318l-2 22H103l-2-22Z" />
      <path className="bench-grain" d="M119 220c92 3 190 3 282 0" />
      <path className="bench-top" d="M84 261c117-3 235-3 352 0l9 9H75l9-9Z" />
      <path className="bench-face" d="M75 270h370l-3 23H78l-3-23Z" />
      <path className="bench-grain" d="M94 282c106 3 226 3 332 0" />
    </svg>
  )
}

function Conductor() {
  return (
    <svg className="stage-conductor" viewBox="0 0 520 330" aria-hidden="true">
      <circle className="conductor-head" cx="260" cy="238" r="15" />
      <path className="conductor-body" d="M243 260c10-6 24-6 34 0l10 70h-54l10-70Z" />
      <path className="arm conductor-arm conductor-arm--left" d="M248 266 227 242 216 216" />
      <path
        className="arm conductor-arm conductor-arm--right"
        d="M272 266 294 240 304 214 313 194"
      />
    </svg>
  )
}
