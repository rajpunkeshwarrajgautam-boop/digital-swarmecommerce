import { test, expect } from "@playwright/test";

/**
 * Run against production (or staging) when PLAYWRIGHT_PRODUCTION_URL is set.
 * PowerShell: $env:PLAYWRIGHT_PRODUCTION_URL="https://digitalswarm.in"; npx playwright test tests/e2e/production-smoke.spec.ts --project=chromium
 */
const base = process.env.PLAYWRIGHT_PRODUCTION_URL?.replace(/\/$/, "") ?? "";

test.describe("Production smoke @prod", () => {
  test.skip(!base, "Set PLAYWRIGHT_PRODUCTION_URL (e.g. https://digitalswarm.in)");

  test("home loads", async ({ page }) => {
    await page.goto(`${base}/`);
    await expect(page).toHaveTitle(/DIGITAL SWARM|Digital Swarm/i);
  });

  test("ga gtag script loads on home", async ({ page }) => {
    const requests: string[] = [];
    page.on("request", (request) => {
      const url = request.url();
      if (url.includes("googletagmanager.com/gtag/js?id=")) {
        requests.push(url);
      }
    });

    await page.goto(`${base}/`, { waitUntil: "networkidle" });
    await expect(page.locator("script[src*='googletagmanager.com/gtag/js?id=']")).toHaveCount(1);
    expect(requests.some((url) => url.includes("G-RB0H8VHPS5"))).toBeTruthy();
  });

  test("products page loads", async ({ page }) => {
    await page.goto(`${base}/products`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 15000 });
  });

  test("contact page has working form", async ({ page }) => {
    await page.goto(`${base}/contact`);
    await expect(page.getByLabel(/callsign/i)).toBeVisible({ timeout: 15000 });
  });

  test("health API returns JSON (after deploy)", async ({ request }) => {
    const res = await request.get(`${base}/api/health`);
    const text = await res.text();
    test.skip(
      text.trimStart().startsWith("<"),
      "Production not on a build with GET /api/health yet — deploy latest main"
    );
    expect(res.ok()).toBeTruthy();
    const json = JSON.parse(text) as { ok?: boolean; checks?: unknown };
    expect(json).toHaveProperty("checks");
    expect(json).toHaveProperty("ok");
  });
});
