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
}

/** A story only one outlet covered. */
export type SoloStory = {
  outlet: number
  title: string
  color: string
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

/** [outlet name, that outlet's headline] for the stage speech bubble. */
export type StageVoice = [name: string, headline: string]

export type TasteScore = { label: string; value: number; color: string }
export type Trend = { label: string; change: string }

/** Everything the home page needs — one request to the backend later. */
export type Feed = {
  stories: Story[]
  soloStories: SoloStory[]
}
