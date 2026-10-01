import { sortOptions } from "@/data/topics"
import type { Sort } from "@/types/news"

type Props = {
  value: Sort
  onChange: (sort: Sort) => void
}

/** "For me / Loudest / Freshest" segmented control. */
export function SortControl({ value, onChange }: Props) {
  return (
    <div className="sort-control">
      {sortOptions.map((option) => (
        <button
          key={option}
          className={value === option ? "active" : ""}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
