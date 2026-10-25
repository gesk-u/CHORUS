/** "4 min ago", "3 h ago", "2 d ago" from a number of minutes. */
export function formatAgo(minutes: number): string {
  if (minutes < 60) return `${minutes} min ago`
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)} h ago`
  return `${Math.floor(minutes / (60 * 24))} d ago`
}
