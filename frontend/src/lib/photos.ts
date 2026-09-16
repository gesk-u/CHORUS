/** Builds a cropped Unsplash image URL. */
export const photoUrl = (id: string, width: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&h=${Math.round(width * 0.48)}&q=72`
