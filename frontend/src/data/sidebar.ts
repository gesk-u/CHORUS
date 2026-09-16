import type { TasteScore, Trend } from "@/types/news"

/** Interest scores the recommender has learned (mock). */
export const tasteScores: TasteScore[] = [
  { label: "Open-source AI", value: 91, color: "#ef5b47" },
  { label: "Climate systems", value: 73, color: "#86b9ee" },
  { label: "Humane tech", value: 58, color: "#83c89b" },
]

export const trends: Trend[] = [
  { label: "Open-weight models", change: "+340%" },
  { label: "Passkeys", change: "+180%" },
  { label: "Satellite texting", change: "+126%" },
]

/** Bar heights for the decorative player waveform. */
export const waveformHeights = [16, 31, 23, 46, 35, 55, 21, 42, 29, 50, 19, 35, 25, 44, 17]
