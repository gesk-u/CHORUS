import type { StoryArtKind, StoryPhoto } from "@/types/news"

/** Unsplash photos used as story art. */
export const storyPhotos: Record<StoryArtKind, StoryPhoto> = {
  robot: {
    id: "1651340765216-ba02df201308",
    alt: "Close-up of a blue circuit board covered in chips",
    credit: "Anne Nygård",
    focus: "50% 45%",
  },
  battery: {
    id: "1558494949-ef010cbdcc31",
    alt: "Glowing server racks threaded with network cables",
    credit: "Taylor Vick",
    focus: "50% 38%",
  },
  key: {
    id: "1689804847843-76c6719a79c7",
    alt: "Phone on a wooden table showing a fingerprint sign-in",
    credit: "ENG-HS",
    focus: "55% 50%",
  },
  satellite: {
    id: "1610457642191-05328cdf34ff",
    alt: "Satellite dish pointed at a star-filled night sky",
    credit: "Stephan Widua",
    focus: "42% 55%",
  },
  phone: {
    id: "1604002629050-83162418e765",
    alt: "Three friends silhouetted against an orange sunset",
    credit: "César Couto",
    focus: "50% 58%",
  },
}
