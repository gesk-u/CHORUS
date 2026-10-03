import { storyPhotos } from "@/data/photos"
import { photoUrl } from "@/lib/photos"
import type { StoryArtKind } from "@/types/news"

const WIDTHS = [480, 720, 1080]

type Props = {
  kind: StoryArtKind
}

/** Story photo with responsive sources and a photographer credit. */
export function StoryArt({ kind }: Props) {
  const photo = storyPhotos[kind]
  return (
    <>
      {/* Plain <img> keeps the design's srcSet/crop logic; swap for next/image if preferred. */}
      <img
        className="story-photo"
        src={photoUrl(photo.id, 720)}
        srcSet={WIDTHS.map((w) => `${photoUrl(photo.id, w)} ${w}w`).join(", ")}
        sizes="(max-width: 760px) 92vw, 430px"
        alt={photo.alt}
        loading="lazy"
        decoding="async"
        style={{ objectPosition: photo.focus }}
      />
      <span className="story-photo-credit">Photo: {photo.credit} / Unsplash</span>
    </>
  )
}
