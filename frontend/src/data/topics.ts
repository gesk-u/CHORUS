import type { Sort, TopicTab } from "@/types/news"

export const topicTabs: TopicTab[] = [
  { label: "All noise", doodle: "♪", color: "#f4d932" },
  { label: "AI", doodle: "⊙", color: "#ef91a7" },
  { label: "Startups", doodle: "↗", color: "#83c89b" },
  { label: "Climate", doodle: "♧", color: "#86b9ee" },
  { label: "Security", doodle: "⌾", color: "#bd91d4" },
  { label: "Science", doodle: "✳", color: "#f19a47" },
]

export const sortOptions: Sort[] = ["For me", "Loudest", "Freshest"]
