import { chromium } from "playwright";

const scenarios = [
  { prompt: "I want to buy Sentinel Research Infiltrator", expectSlug: "sentinel-research-infiltrator" },
  { prompt: "Buy Swarm Cinema Infiltrator now", expectSlug: "cinema-infiltrator" },
  { prompt: "I want to order Swarm Sales Infiltrator", expectSlug: "sales-infiltrator" },
  { prompt: "Purchase AI for Healthcare", expectSlug: "ai-for-healthcare" },
  { prompt: "Get me AI for SaaS", expectSlug: "ai-for-saas" }
];

async function runScenario(browser, scenario) {
  const page = await browser.newPage();
  try {
    await page.goto("https://digitalswarm.in", { waitUntil: "networkidle" });
    await page.locator("#chat-toggle-btn").click();
    await page.fill('input[placeholder="Ask me anything..."]', scenario.prompt);
    await page.keyboard.press("Enter");

    const triggerButton = page.locator('button:has-text("PROCURE ASSET")').last();
    await triggerButton.waitFor({ timeout: 12000 });

    const chatText = await page.locator("div.max-w-\[85\%\]").last().innerText().catch(() => "");
    await triggerButton.click();
    await page.waitForURL("**/checkout", { timeout: 12000 });

    const ok = page.url().includes("/checkout");
    return {
      prompt: scenario.prompt,
      expectSlug: scenario.expectSlug,
      checkoutReached: ok,
      status: ok ? "PASS" : "FAIL",
      note: chatText.slice(0, 120)
    };
  } catch (error) {
    return {
      prompt: scenario.prompt,
      expectSlug: scenario.expectSlug,
      checkoutReached: false,
      status: "FAIL",
      note: String(error).slice(0, 180)
    };
  } finally {
    await page.close();
  }
}

const browser = await chromium.launch({ headless: true });
const results = [];
for (const scenario of scenarios) {
  results.push(await runScenario(browser, scenario));
}
await browser.close();

console.log(JSON.stringify({ total: results.length, pass: results.filter(r => r.status === "PASS").length, results }, null, 2));
