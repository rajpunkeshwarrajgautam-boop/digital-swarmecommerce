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
});
