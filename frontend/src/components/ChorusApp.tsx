"use client"

import { useState } from "react"
import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"
import { NewsTicker } from "@/components/layout/NewsTicker"
import { SideCurtains } from "@/components/layout/SideCurtains"
import { SvgFilters } from "@/components/ui/SvgFilters"

/**
 * Owns the page's interactive state and passes it down.
 * Every visual piece lives in its own file.
 */
export function ChorusApp() {
  const [query, setQuery] = useState("")
  const [live, setLive] = useState(true)

  return (
    <div className={`chorus-app ${live ? "is-live" : "is-paused"}`}>
      <SvgFilters />
      <Header
        savedCount={0}
        query={query}
        onQueryChange={setQuery}
        live={live}
        onToggleLive={() => setLive(!live)}
      />
      <NewsTicker />
      <SideCurtains />

      <main className="page" />

      <Footer />
    </div>
  )
}
