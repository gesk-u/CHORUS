import type { Story } from "@/types/news"
import { ChorusPlayer } from "./ChorusPlayer"
import { ConductorCard } from "./ConductorCard"
import { Crescendo } from "./Crescendo"
import { VoicesCard } from "./VoicesCard"

type Props = {
  stories: Story[]
  muted: number[]
  onToggleMuted: (outlet: number) => void
  onUnmuteAll: () => void
}

/** Sidebar: audio briefing, recommender insights, outlet muting, trends. */
export function RightRail({ stories, muted, onToggleMuted, onUnmuteAll }: Props) {
  return (
    <aside className="right-rail">
      <ChorusPlayer />
      <ConductorCard />
      <VoicesCard
        stories={stories}
        muted={muted}
        onToggleMuted={onToggleMuted}
        onUnmuteAll={onUnmuteAll}
      />
      <Crescendo />
    </aside>
  )
}
