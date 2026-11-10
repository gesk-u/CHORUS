import { ChorusApp } from "@/components/ChorusApp"
import { getFeed } from "@/lib/api"

// Live feed: render on every request, never prerender at build time.
export const dynamic = "force-dynamic"

/** Home page. Loads the feed on the server, then hands it to the client UI. */
export default async function HomePage() {
  const feed = await getFeed()
  return <ChorusApp feed={feed} />
}
