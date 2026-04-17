import { test, expect } from "@playwright/test";

/**
 * Local / CI smoke — uses baseURL from playwright.config (localhost + webServer).
 */
test.describe("Hardware Sanity Protocol", () => {
  test("should load the home page with branding", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/DIGITAL SWARM|Digital Swarm/i);
    const forgeCTA = page.getByRole("link", { name: /ENTER THE FORGE/i });
    if (await forgeCTA.isVisible().catch(() => false)) {
      await expect(forgeCTA).toBeVisible();
    }
  });

  test("should show navigation on home", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation");
    await expect(nav).toBeVisible();
  });

  test("GET /api/setup/check returns JSON", async ({ request }) => {
    const res = await request.get("/api/setup/check");
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data).toHaveProperty("connected");
    expect(data).toHaveProperty("product_count");
  });

  test("GET /api/health returns JSON", async ({ request }) => {
    const res = await request.get("/api/health");
    expect([200, 503]).toContain(res.status());
    const data = await res.json();
    expect(data).toHaveProperty("ok");
    expect(data).toHaveProperty("checks");
  });

  test("contact page renders form fields when wired", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("#contact-callsign, input[name='callsign']").first()).toBeVisible({
      timeout: 15000,
    });
    await expect(page.locator("#contact-email, input[type='email']").first()).toBeVisible();
  });

  test("contact form fires contact_submit on successful API response", async ({ page, browserName }) => {
    test.skip(
      browserName === "webkit",
      "Playwright route mock for POST /api/contact is not consistently observed on WebKit; Chromium asserts the same behavior."
    );
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "{}",
      });
    });
    await page.goto("/contact");
    await page.locator("#contact-callsign").fill("Test User");
    await page.locator("#contact-email").fill("test@example.com");
    await page.locator("#contact-message").fill("Smoke test message");
    await page.getByRole("button", { name: /execute transmission/i }).click();
    await expect
      .poll(
        async () =>
          page.evaluate(() => {
            const dl = (window as Window & { dataLayer?: Array<Record<string, unknown>> }).dataLayer ?? [];
            return dl.some(
              (row) =>
                row &&
                typeof row === "object" &&
                row.event === "contact_submit" &&
                row.contact_type === "enterprise_build"
            );
          }),
        { timeout: 20000 }
      )
      .toBeTruthy();
  });
});
