import type { SoloStory, Story } from "@/types/news"

/** Mock feed. Replaced by backend data via src/lib/api.ts. */
export const stories: Story[] = [
  {
    id: 1,
    topic: "AI",
    time: 4,
    outlets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    extraVoices: 3,
    title: "Open models are suddenly singing in the same key",
    deck: "A string of smaller releases is closing the performance gap—and putting pressure on the biggest labs.",
    reason: "because you read 4 open-source stories this week",
    color: "#f4d932",
    art: "robot",
  },
  {
    id: 2,
    topic: "Climate",
    time: 13,
    outlets: [3, 0, 2, 4, 6, 9, 10, 11],
    title: "Data centers learn when to hush for the power grid",
    deck: "Flexible compute is becoming an unlikely tool for balancing renewable energy.",
    reason: "you linger on climate systems",
    color: "#83c89b",
    art: "battery",
  },
  {
    id: 3,
    topic: "Security",
    time: 22,
    outlets: [2, 1, 4, 5, 7, 11],
    title: "Passkeys finally move beyond the early-adopter crowd",
    deck: "Banks and travel apps are driving the biggest jump in password-free sign-ins yet.",
    reason: "a fresh angle on an old obsession",
    color: "#ef92aa",
    art: "key",
  },
  {
    id: 4,
    topic: "Science",
    time: 31,
    outlets: [1, 0, 2, 4, 6, 7, 8, 9, 10, 11],
    title: "Satellite texting is about to feel wonderfully boring",
    deck: "The next generation of phones will quietly fill in the places towers cannot reach.",
    reason: "you saved 3 space stories",
    color: "#86b9ee",
    art: "satellite",
  },
  {
    id: 5,
    topic: "Startups",
    time: 47,
    outlets: [7, 1, 5, 8],
    title: "A social app designed to end before you get tired",
    deck: "No follower counts, no infinite scroll, and a daily closing time.",
    reason: "because humane tech is your thing",
    color: "#bb91d4",
    art: "phone",
  },
]

export const soloStories: SoloStory[] = [
  { outlet: 5, title: "The tiny repair shop keeping a whole town online", color: "#f4d932" },
  { outlet: 8, title: "Inside the phone market that runs entirely on trust", color: "#ef91a7" },
  { outlet: 4, title: "A 20-year-old console gets one last, lovely fix", color: "#86b9ee" },
]

/** Placeholder alternative headlines shown in the story drawer. */
export const alternateHeadlines: string[] = [
  "Why smaller systems suddenly look much more capable",
  "The open-source gap narrows again",
  "New releases put pressure on closed-model pricing",
  "A very good week for local AI",
  "Benchmarks are only half the story",
]

export const tickerHeadlines: string[] = [
  "Open models hit a new high note",
  "Passkeys reach the mainstream",
  "Satellite texting gets very real",
]
