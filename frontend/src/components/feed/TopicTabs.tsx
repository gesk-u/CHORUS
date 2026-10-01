import type { CSSProperties } from "react"
import { topicTabs } from "@/data/topics"
import type { Topic } from "@/types/news"

type Props = {
  active: Topic
  onChange: (topic: Topic) => void
}

/** Topic filter row. */
export function TopicTabs({ active, onChange }: Props) {
  return (
    <div className="topic-tabs">
      {topicTabs.map((tab) => (
        <button
          key={tab.label}
          className={active === tab.label ? "active" : ""}
          style={{ "--tab-color": tab.color } as CSSProperties}
          onClick={() => onChange(tab.label)}
        >
          <i>{tab.doodle}</i>
          {tab.label}
        </button>
      ))}
    </div>
  )
}
