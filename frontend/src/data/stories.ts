import type { SoloStory, Story, StoryVersion } from "@/types/news"
import { voices } from "./voices"

/**
 * Mock feed, used when NEXT_PUBLIC_API_URL is not set. It has the same shape
 * as the backend's /feed response, so the UI works the same either way.
 */

type MockStory = Omit<Story, "versions" | "inTune">

const mockStories: MockStory[] = [
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

/** Placeholder per-outlet headlines (from the Figma design), by outlet index. */
const mockHeadlines: string[] = [
  "Open releases narrow the performance gap again",
  "The gap is closing much faster than expected",
  "Small models are having a very big week",
  "Open AI puts new pressure on premium pricing",
  "Local models just became far more practical",
  "Running capable AI locally gets much easier",
  "Benchmarks show a fast-changing field",
  "A new release resets startup expectations",
  "Cheaper models could widen global access",
  "Investors rethink the closed-model advantage",
  "The race shifts from scale to distribution",
  "Efficiency gains matter more than model size",
]

const mockVersions = (story: MockStory): StoryVersion[] =>
  story.outlets.map((outlet, i) => ({
    outlet,
    outletName: voices[outlet].name,
    title: i === 0 ? story.title : mockHeadlines[outlet],
    url: "#",
    minutesAgo: story.time + i * 3,
    inTune: 94 - i * 2,
  }))

export const stories: Story[] = mockStories.map((story) => {
  const versions = mockVersions(story)
  const inTune = Math.round(versions.reduce((sum, v) => sum + v.inTune, 0) / versions.length)
  return { ...story, versions, inTune }
})

export const soloStories: SoloStory[] = [
  { outlet: 5, title: "The tiny repair shop keeping a whole town online", color: "#f4d932" },
  { outlet: 8, title: "Inside the phone market that runs entirely on trust", color: "#ef91a7" },
  { outlet: 4, title: "A 20-year-old console gets one last, lovely fix", color: "#86b9ee" },
]

export const tickerHeadlines: string[] = [
  "Open models hit a new high note",
  "Passkeys reach the mainstream",
  "Satellite texting gets very real",
]
