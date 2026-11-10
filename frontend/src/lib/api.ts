import { soloStories, stories } from "@/data/stories"
import type { Feed } from "@/types/news"

/** FastAPI backend URL. Unset = mock data, no live updates. */
export const API_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * Loads the home feed. Calls the FastAPI backend when NEXT_PUBLIC_API_URL is
 * set; otherwise returns the mock data so the UI works on its own.
 */
export async function getFeed(): Promise<Feed> {
  if (!API_URL) return { stories, soloStories, version: "mock" }

  // The free Render backend sleeps when idle and takes up to a minute to wake,
  // answering with errors meanwhile. Keep retrying for a while before giving up.
  const deadline = Date.now() + 60_000
  let lastError: unknown
  while (Date.now() < deadline) {
    try {
      // Always fetch fresh: it's a live feed, and a cached copy can outlive an API change.
      const res = await fetch(`${API_URL}/feed`, {
        cache: "no-store",
        signal: AbortSignal.timeout(30_000),
      })
      if (res.ok) return res.json()
      lastError = new Error(`Feed request failed: ${res.status}`)
    } catch (err) {
      lastError = err
    }
    await new Promise((resolve) => setTimeout(resolve, 3_000))
  }
  throw lastError
}

/** The backend's current feed version, or null if it can't be reached. */
export async function getFeedVersion(): Promise<string | null> {
  if (!API_URL) return null
  try {
    const res = await fetch(`${API_URL}/feed/version`, { cache: "no-store" })
    if (!res.ok) return null
    const body: { version: string } = await res.json()
    return body.version
  } catch {
    return null // backend restarting or offline: try again next time
  }
}
