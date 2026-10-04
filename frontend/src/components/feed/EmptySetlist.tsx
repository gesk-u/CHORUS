import { Singer } from "@/components/ui/Singer"

type Props = {
  onReset: () => void
}

/** Shown when filters and search leave no stories. */
export function EmptySetlist({ onReset }: Props) {
  return (
    <div className="empty-paper">
      <Singer index={4} />
      <h3>That section is taking a breath.</h3>
      <p>Try another topic or clear your search.</p>
      <button onClick={onReset}>Back to all the noise</button>
    </div>
  )
}
