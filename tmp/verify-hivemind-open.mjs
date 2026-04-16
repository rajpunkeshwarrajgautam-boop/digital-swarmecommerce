import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto("https://digitalswarm.in", { waitUntil: "networkidle" });

const toggle = page.locator("#chat-toggle-btn");
const hasToggle = (await toggle.count()) > 0;
let opened = false;
if (hasToggle) {
  await toggle.click();
  try {
    await page.waitForSelector('input[placeholder="Ask me anything..."]', { timeout: 5000 });
    opened = true;
  } catch {
    opened = false;
  }
}

console.log(JSON.stringify({ exists: hasToggle, opened }, null, 2));
await browser.close();
