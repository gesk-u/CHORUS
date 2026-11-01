import { expect, test, type Page } from "@playwright/test"

const cards = (page: Page) => page.locator(".setlist .story-card")
const cardTitles = (page: Page) => cards(page).locator("h3")
const search = (page: Page) => page.getByPlaceholder("Hum a story...")

test.beforeEach(async ({ page }) => {
  await page.goto("/")
  await expect(cards(page).first()).toBeVisible()
})

test("shows the headliner and the story setlist", async ({ page }) => {
  await expect(page.locator(".theater-header")).toBeVisible()
  await expect(page.getByRole("button", { name: "ON AIR" })).toBeVisible()
  expect(await cards(page).count()).toBeGreaterThanOrEqual(5)
})

test("topic tabs keep only stories from that topic", async ({ page }) => {
  await page.locator(".topic-tabs").getByRole("button", { name: "Security" }).click()
  const metas = cards(page).locator(".story-meta")
  await expect(metas.first()).toBeVisible()
  for (const meta of await metas.all()) {
    await expect(meta).toContainText("Security")
  }
})

test("search ignores upper and lower case", async ({ page }) => {
  await search(page).fill("PASSKEYS")
  await expect(cardTitles(page)).toHaveCount(1)
  await expect(cardTitles(page).first()).toContainText("Passkeys")
})

test("empty search shows the empty state and the reset button brings stories back", async ({
  page,
}) => {
  const total = await cards(page).count()
  await search(page).fill("no story is called this")
  await expect(page.getByText("That section is taking a breath.")).toBeVisible()
  await page.getByRole("button", { name: "Back to all the noise" }).click()
  await expect(cards(page)).toHaveCount(total)
  await expect(search(page)).toHaveValue("")
})

test("Freshest puts the newest story first", async ({ page }) => {
  await page.locator(".sort-control").getByRole("button", { name: "Freshest" }).click()
  const minutes = await cards(page)
    .locator(".story-meta span:last-child")
    .allInnerTexts()
  const values = minutes.map((text) => (/now/i.test(text) ? 0 : parseInt(text, 10) || Infinity))
  expect(values).toEqual([...values].sort((a, b) => a - b))
})

test("muting an outlet updates the voices count and can be undone", async ({ page }) => {
  const voicesCard = page.locator(".voices-card")
  // Some outlets may start hushed, so read the starting count instead of assuming it.
  const heading = await voicesCard.locator(".voices-head h3").innerText()
  const [singing, total] = heading.match(/\d+/g)!.map(Number)
  await voicesCard.getByRole("button", { name: "Mute Reuters" }).click()
  await expect(voicesCard).toContainText(`${singing - 1} of ${total} singing`)
  await expect(voicesCard.getByRole("button", { name: "Unmute Reuters" })).toHaveAttribute(
    "aria-pressed",
    "true",
  )
  await voicesCard.getByRole("button", { name: "unmute everyone" }).click()
  await expect(voicesCard).toContainText(`${total} of ${total} singing`)
})

test("saving a story bumps the Encore counter", async ({ page }) => {
  await cards(page).first().getByRole("button", { name: "Save" }).click()
  await expect(cards(page).first().getByRole("button", { name: "Encore!" })).toBeVisible()
  await expect(page.locator(".theater-header nav")).toContainText("Encore 1")
})

test("the story drawer opens from a card and closes with the button or Escape", async ({
  page,
}) => {
  const title = await cardTitles(page).first().innerText()
  await cards(page).first().getByRole("button", { name: /Hear the choir/ }).click()
  const drawer = page.getByRole("dialog")
  await expect(drawer.getByRole("heading", { level: 2 })).toHaveText(title)

  await page.keyboard.press("Escape")
  await expect(drawer).toBeHidden()

  await cards(page).first().getByRole("button", { name: /Hear the choir/ }).click()
  await drawer.getByRole("button", { name: "Close story" }).click()
  await expect(drawer).toBeHidden()
})
