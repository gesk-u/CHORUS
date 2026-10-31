"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { getFeedVersion } from "@/lib/api"

const POLL_MS = 60_000

/**
 * While `enabled` (ON AIR), asks the backend every minute whether the feed
 * changed, and re-renders the page with fresh data only when it did.
 * Skips checks while the tab is hidden.
 */
export function useLiveFeed(version: string, enabled: boolean) {
  const router = useRouter()

  useEffect(() => {
    if (!enabled || version === "mock") return

    const check = async () => {
      if (document.hidden) return
      const latest = await getFeedVersion()
      if (latest !== null && latest !== version) router.refresh()
    }

    const timer = setInterval(check, POLL_MS)
    // Catch up straight away when the reader comes back to the tab.
    document.addEventListener("visibilitychange", check)
    return () => {
      clearInterval(timer)
      document.removeEventListener("visibilitychange", check)
    }
  }, [version, enabled, router])
}
