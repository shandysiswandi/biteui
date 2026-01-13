import { expect, test } from "@playwright/test"

test.describe("Home", () => {
  test("get started links to login", async ({ page }) => {
    await page.goto("/")

    const link = page.getByRole("link", { name: "Get Started" })
    await expect(link).toHaveAttribute("href", "/login")
  })

  test("renders hero messaging", async ({ page }) => {
    await page.goto("/")

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Modern product rituals/i,
      }),
    ).toBeVisible()
    await expect(page.getByText(/BiteUI helps modern teams plan/i)).toBeVisible()
  })

  test("shows feature highlights", async ({ page }) => {
    await page.goto("/")

    const features = ["Signal routing", "Live playbooks", "Compliance ready", "Customer pulse"]

    for (const feature of features) {
      await expect(page.getByRole("heading", { level: 3, name: feature })).toBeVisible()
    }
  })

  test("exposes contact form fields", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByLabel("First name")).toHaveAttribute("placeholder", "Avery")
    await expect(page.getByLabel("Last name")).toHaveAttribute("placeholder", "Stone")
    await expect(page.getByLabel("Work email")).toHaveAttribute("placeholder", "you@studio.com")
    await expect(page.getByLabel("What are you building?")).toHaveAttribute(
      "placeholder",
      "Share goals, timeline, and team size.",
    )
    await expect(page.getByRole("button", { name: "Send message" })).toBeVisible()
  })

  test("lists contact options and footer copy", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByText("hello@biteui.co")).toBeVisible()
    await expect(page.getByText("partners@biteui.co")).toBeVisible()
    await expect(page.getByText("support@biteui.co")).toBeVisible()
    await expect(page.getByText("Build calmer launches with BiteUI.")).toBeVisible()
  })
})
