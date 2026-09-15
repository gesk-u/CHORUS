import type { Story } from "@/types/news"

/** Outlets covering the story that the reader has not muted. */
export const activeOutlets = (story: Story, muted: number[]) =>
  story.outlets.filter((outlet) => !muted.includes(outlet))

/** How many voices are still singing this story. */
export const voiceCount = (story: Story, muted: number[]) =>
  activeOutlets(story, muted).length + (story.extraVoices ?? 0)

export const pluralize = (count: number, one: string, many: string) =>
  count === 1 ? one : many
