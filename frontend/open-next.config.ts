import { defineCloudflareConfig } from "@opennextjs/cloudflare"

// Defaults are fine: the feed is fetched fresh on every request (no ISR cache needed).
export default defineCloudflareConfig()
