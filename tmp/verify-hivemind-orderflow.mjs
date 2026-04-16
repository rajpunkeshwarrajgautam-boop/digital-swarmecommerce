import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto("https://digitalswarm.in", { waitUntil: "networkidle" });

await page.locator("#chat-toggle-btn").click();
await page.fill('input[placeholder="Ask me anything..."]', 'I want to buy Sentinel Research Infiltrator (AI Agent)');
await page.keyboard.press('Enter');
await page.waitForSelector('button:has-text("PROCURE ASSET")', { timeout: 12000 });
await page.click('button:has-text("PROCURE ASSET")');
await page.waitForURL('**/checkout', { timeout: 12000 });

console.log(JSON.stringify({ checkoutReached: true, url: page.url() }, null, 2));
await browser.close();
