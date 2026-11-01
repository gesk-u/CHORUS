import { defineConfig, devices } from "@playwright/test"

const PORT = 3100

/**
 * End-to-end tests run against the mock data (no FastAPI backend needed):
 * NEXT_PUBLIC_API_URL is cleared for the dev server Playwright starts.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run dev -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    env: { NEXT_PUBLIC_API_URL: "" },
    timeout: 120_000,
  },
})
