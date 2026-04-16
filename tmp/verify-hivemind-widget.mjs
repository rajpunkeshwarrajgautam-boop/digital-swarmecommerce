import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto("https://digitalswarm.in", { waitUntil: "networkidle" });

const result = await page.evaluate(() => {
  const toggle = document.querySelector("#chat-toggle-btn");
  if (!toggle) return { exists: false, opened: false };
  toggle.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  const input = document.querySelector('input[placeholder="Ask me anything..."]');
  return { exists: true, opened: Boolean(input) };
});

console.log(JSON.stringify(result, null, 2));
await browser.close();
