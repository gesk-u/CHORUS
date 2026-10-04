import type { Sort, Story } from "@/types/news"
import { EmptySetlist } from "./EmptySetlist"
import { SortControl } from "./SortControl"
import { StoryCard } from "./StoryCard"

type Props = {
  stories: Story[]
  muted: number[]
  saved: number[]
  sort: Sort
  onSortChange: (sort: Sort) => void
  onToggleSave: (id: number) => void
  onOpen: (story: Story) => void
  onReset: () => void
}

/** The main recommended feed: heading, sort control and story grid. */
export function Setlist({
  stories,
  muted,
  saved,
  sort,
  onSortChange,
  onToggleSave,
  onOpen,
  onReset,
}: Props) {
  return (
    <>
      <div className="section-heading">
        <div>
          <span className="hand-arrow">→</span>
          <p className="scribble-note">picked by your conductor</p>
          <h2>THE SETLIST</h2>
        </div>
        <SortControl value={sort} onChange={onSortChange} />
      </div>
      <div className="story-grid">
        {stories.length ? (
          stories.map((story, index) => (
            <StoryCard
              key={story.id}
              story={story}
              index={index}
              muted={muted}
              saved={saved.includes(story.id)}
              onSave={() => onToggleSave(story.id)}
              onOpen={() => onOpen(story)}
            />
          ))
        ) : (
          <EmptySetlist onReset={onReset} />
        )}
      </div>
    </>
  )
}
