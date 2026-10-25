/** Shared domain types. These mirror what the FastAPI backend will return. */

export type Topic = "All noise" | "AI" | "Startups" | "Climate" | "Security" | "Science"
export type StoryTopic = Exclude<Topic, "All noise">
export type Sort = "For me" | "Loudest" | "Freshest"

/** A news outlet ("voice" in the choir). Outlets are referenced by their index. */
export type Voice = {
  name: string
  color: string
}

export type StoryArtKind = "robot" | "battery" | "key" | "satellite" | "phone"

/** One outlet's take on a story: its own headline and link. */
export type StoryVersion = {
  /** Index into `voices`, or null for an outlet that isn't drawn on stage. */
  outlet: number | null
  outletName: string
  title: string
  url: string
  minutesAgo: number
  /** 0-100: how close this article is to the story's centre. */
  inTune: number
}

/** A cluster of articles from several outlets that cover the same event. */
export type Story = {
  id: number
  topic: StoryTopic
  /** Minutes since the story first appeared. */
  time: number
  /** Indexes into `voices` of the outlets covering this story. */
  outlets: number[]
  /** Outlets beyond the known list ("in the wings"). */
  extraVoices?: number
  title: string
  deck: string
  /** Why the recommender picked this story for the reader. */
  reason: string
  color: string
  art: StoryArtKind
  /** Average of the versions' inTune. */
  inTune: number
  /** One entry per outlet, ordered by who published first. */
  versions: StoryVersion[]
}

/** A story only one outlet covered. */
export type SoloStory = {
  outlet: number
  title: string
  color: string
  url?: string
}

export type TopicTab = {
  label: Topic
  doodle: string
  color: string
}

export type StoryPhoto = {
  id: string
  alt: string
  credit: string
  focus: string
}

export type TasteScore = { label: string; value: number; color: string }
export type Trend = { label: string; change: string }

/** Everything the home page needs — one request to the backend later. */
export type Feed = {
  stories: Story[]
  soloStories: SoloStory[]
}
