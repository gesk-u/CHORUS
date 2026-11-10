"use client"

import { useRouter } from "next/navigation"
import { startTransition } from "react"

/**
 * Shown when the home page can't load the feed (usually the free backend is
 * still waking up). Lets the reader retry instead of seeing a bare 500 page.
 */
export default function FeedError({ reset }: { error: Error; reset: () => void }) {
  const router = useRouter()

  function retry() {
    startTransition(() => {
      router.refresh()
      reset()
    })
  }

  return (
    <main style={{ maxWidth: 560, margin: "80px auto", padding: "0 16px" }}>
      <div className="empty-paper">
        <h3>The choir is warming up</h3>
        <p>The news server is waking up. This can take up to a minute, so try again shortly.</p>
        <button type="button" onClick={retry}>
          Try again
        </button>
      </div>
    </main>
  )
}
