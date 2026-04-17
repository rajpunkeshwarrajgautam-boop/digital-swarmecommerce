/**
 * Opens operator dashboards in one Playwright Chromium window (one tab each).
 * Run from repo root: npm run open:dashboards
 *
 * GA4/GTM/Supabase/Vercel admin steps still require your logged-in browser session;
 * see .planning/analytics/GA4-hero-ab-playbook.md and .planning/DASHBOARDS.md
 */

import { chromium } from "playwright";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.join(root, ".env.local") });
dotenv.config({ path: path.join(root, ".env") });

function supabaseProjectDashboardUrl() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) {
    return "https://supabase.com/dashboard/projects";
  }
  try {
    const host = new URL(raw).hostname;
    const ref = host.split(".")[0];
    if (!ref || host === "supabase.co") return "https://supabase.com/dashboard/projects";
    return `https://supabase.com/dashboard/project/${ref}`;
  } catch {
    return "https://supabase.com/dashboard/projects";
  }
}

const urls = [
  "https://github.com/rajpunkeshwarrajgautam-boop/digital-swarmecommerce",
  "https://vercel.com/rajpunkeshwarrajgautam-boops-projects/antigravity-ecommerce",
  supabaseProjectDashboardUrl(),
  "https://analytics.google.com/",
  "https://tagmanager.google.com/",
];

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext();
for (const url of urls) {
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });
}
process.stdout.write(
  "Playwright Chromium: 5 tabs loaded. Close the browser window when finished.\n" +
    "GA4 / GTM admin: .planning/analytics/GA4-hero-ab-playbook.md\n"
);
await new Promise((resolve) => browser.on("disconnected", resolve));
