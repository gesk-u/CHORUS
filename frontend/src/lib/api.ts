import { soloStories, stories } from "@/data/stories"
import type { Feed } from "@/types/news"

/** Loads the home feed. Mock data for now; the backend comes later. */
export async function getFeed(): Promise<Feed> {
  return { stories, soloStories }
}
