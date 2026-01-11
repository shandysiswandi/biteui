import { expect, test } from "@playwright/test"

test("home to login to dashboard with user email", async ({ page }) => {
  const email = "user@gobite.com"
  const password = "Secret123!"
  const fullName = "User"

  await page.goto("/", { waitUntil: "networkidle" })

  await page.getByRole("link", { name: "Get Started" }).click()
  await expect(page).toHaveURL("/login")

  const headingLogin = page.getByRole("heading", { name: "Login to your account" })
  await expect(headingLogin).toBeVisible()

  await page.getByLabel("Email").fill(email)
  await page.getByLabel("Password").fill(password)

  await page.getByRole("button", { name: "Login" }).click()
  await expect(page).toHaveURL("/app/dashboard")

  const userButton = page.getByRole("button", { name: fullName })
  await expect(userButton).toBeVisible()

  await userButton.click()
  await expect(page.getByText(email)).toBeVisible()
})
