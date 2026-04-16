import { chromium } from "playwright";

const scenarios = [
  { prompt: "I want to buy Sentinel Research Infiltrator" },
  { prompt: "Buy Swarm Cinema Infiltrator now" },
  { prompt: "I want to order Swarm Sales Infiltrator" },
  { prompt: "Purchase AI for Healthcare" },
  { prompt: "Get me AI for SaaS" }
];

async function runOne(browser, prompt) {
  const page = await browser.newPage();
  try {
    await page.goto("https://digitalswarm.in", { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.locator("#chat-toggle-btn").click({ timeout: 10000 });
    await page.fill('input[placeholder="Ask me anything..."]', prompt);
    await page.keyboard.press("Enter");
    const trigger = page.locator('button:has-text("PROCURE ASSET")').last();
    await trigger.waitFor({ timeout: 15000 });
    await trigger.click();
    await page.waitForURL("**/checkout", { timeout: 15000 });
    return { prompt, status: "PASS", url: page.url() };
  } catch (e) {
    return { prompt, status: "FAIL", note: String(e).slice(0, 160) };
  } finally {
    await page.close();
  }
}

const browser = await chromium.launch({ headless: true });
const results = [];
for (const s of scenarios) results.push(await runOne(browser, s.prompt));
await browser.close();
console.log(JSON.stringify({ total: results.length, pass: results.filter(r => r.status === "PASS").length, results }, null, 2));
