import { expect, test } from "@playwright/test"

test.describe("Login flow scenario", () => {
  test("home to login to dashboard with user email", async ({ page }) => {
    const email = "avery.stone@biteui.co"
    const password = "super-secret-password"
    const fullName = "Avery Stone"

    await page.route("**/api/v1/identity/login", async (route) => {
      const payload = route.request().postDataJSON() as {
        email: string
        password: string
      }

      expect(payload.email).toBe(email)
      expect(payload.password).toBe(password)

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message: "ok",
          data: {
            access_token: "test-access-token",
            refresh_token: "test-refresh-token",
          },
        }),
      })
    })

    await page.route("**/api/v1/identity/profile", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message: "ok",
          data: {
            id: 1,
            email,
            full_name: fullName,
            avatar_url: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
            status: "active",
          },
        }),
      })
    })

    await page.route("**/api/v1/iam/me/permissions", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message: "ok",
          data: {
            permissions: {},
          },
        }),
      })
    })

    await page.goto("/")

    await page.getByRole("link", { name: "Get Started" }).click()
    await expect(page).toHaveURL("/login")

    await page.getByLabel("Email").fill(email)
    await page.getByLabel("Password").fill(password)
    await page.getByRole("button", { name: "Login" }).click()

    await expect(page).toHaveURL("/app/dashboard")

    const userButton = page.getByRole("button", { name: fullName })
    await expect(userButton).toBeVisible()
    await userButton.click()

    await expect(page.getByText(email)).toBeVisible()
  })
})
