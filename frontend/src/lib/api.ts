import { soloStories, stories } from "@/data/stories"
import type { Feed } from "@/types/news"

const API_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * Loads the home feed. Calls the FastAPI backend when NEXT_PUBLIC_API_URL is
 * set; otherwise returns the mock data so the UI works on its own.
 */
export async function getFeed(): Promise<Feed> {
  if (!API_URL) return { stories, soloStories }

  // Always fetch fresh: it's a live feed, and a cached copy can outlive an API change.
  const res = await fetch(`${API_URL}/feed`, { cache: "no-store" })
  if (!res.ok) throw new Error(`Feed request failed: ${res.status}`)
  return res.json()
}
