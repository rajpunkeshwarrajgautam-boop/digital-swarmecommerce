import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const storageOrigin =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ??
  "https://uhswcljouelyprsinchj.supabase.co";
const BASE = `${storageOrigin}/storage/v1/object/public/product-downloads`;
const SITE_BASE = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://digitalswarm.in";

// Map every product name in DB to the correct zip URL
// Products without a dedicated zip → use the closest matching agent
// Canonical AI Agent titles: src/db/schema.sql (insert … on conflict name)
const urlMap: Record<string, string> = {
  // Schema seed (digital-swarm) — names must match `products.name` exactly
  "Sentinel Research Infiltrator (AI Agent)": `${BASE}/swarm-trend-oracle/swarm-trend-oracle.zip`,
  "Swarm Corporate Growth Team (Multi-Agent)": `${BASE}/swarm-sales-infiltrator/swarm-sales-infiltrator.zip`,
  "Swarm Cinema Infiltrator (AI Movie Producer)": `${BASE}/swarm-trend-oracle/swarm-trend-oracle.zip`,
  "Swarm Cinema Infiltrator (AI Producer)": `${BASE}/swarm-trend-oracle/swarm-trend-oracle.zip`,
  "Swarm Browser MCP (Openwork Automation)": `${BASE}/swarm-capital-oracle/swarm-capital-oracle.zip`,
  "Swarm Deep Research Agent (Llama3 Local)": `${BASE}/swarm-trend-oracle/swarm-trend-oracle.zip`,
  "Swarm Multimodal UI/UX Engine (Nano Banana)": `${BASE}/swarm-trend-oracle/swarm-trend-oracle.zip`,

  // Exact matches (7 new standalone ZIPs)
  "Swarm Sales Infiltrator (Dashboard Edition)":      `${BASE}/swarm-sales-infiltrator/swarm-sales-infiltrator.zip`,
  "Swarm Finance Oracle (Dashboard Edition)":          `${BASE}/swarm-finance-oracle/swarm-finance-oracle.zip`,
  "Swarm Legal Architect (Dashboard Edition)":         `${BASE}/swarm-legal-architect/swarm-legal-architect.zip`,
  "Swarm Recruitment Command (Dashboard Edition)":     `${BASE}/swarm-recruitment-command/swarm-recruitment-command.zip`,
  "Swarm Capital Trend Oracle (Dashboard Edition)":    `${BASE}/swarm-trend-oracle/swarm-trend-oracle.zip`,
  "Swarm Property Infiltrator (Dashboard Edition)":    `${BASE}/swarm-property-infiltrator/swarm-property-infiltrator.zip`,
  "Swarm Capital Oracle (VC Due Diligence)":           `${BASE}/swarm-capital-oracle/swarm-capital-oracle.zip`,

  // Legacy / alternate-named products → best-fit mapping
  "Sentinel Research Infiltrator (Universal Dashboard)": `${BASE}/swarm-sales-infiltrator/swarm-sales-infiltrator.zip`,
  "Sentinel Research Infiltrator (Deep Intelligence)":   `${BASE}/swarm-trend-oracle/swarm-trend-oracle.zip`,
  "Sentinel SEO Infiltrator (Organic Hive)":             `${BASE}/swarm-trend-oracle/swarm-trend-oracle.zip`,
  "Sentinel Global Voyager (Travel Planner)":            `${BASE}/swarm-trend-oracle/swarm-trend-oracle.zip`,
  "Swarm Legal Infiltrator (Contract Oracle)":           `${BASE}/swarm-legal-architect/swarm-legal-architect.zip`,
  "Swarm Finance Infiltrator (xAI Oracle)":              `${BASE}/swarm-finance-oracle/swarm-finance-oracle.zip`,
  "Swarm Corporate Growth Team (Autonomous Sales)":      `${BASE}/swarm-sales-infiltrator/swarm-sales-infiltrator.zip`,
  "Swarm Property Infiltrator (Market Oracle)":          `${BASE}/swarm-property-infiltrator/swarm-property-infiltrator.zip`,
  "Swarm Talent Infiltrator (HR Oracle)":                `${BASE}/swarm-recruitment-command/swarm-recruitment-command.zip`,
  "Swarm Voice Orator (Narrative Synth)":                `${BASE}/swarm-capital-oracle/swarm-capital-oracle.zip`,
  // Non-agent bundles currently served from public site files
  "1000 Manually Tested Web Applications": `${SITE_BASE}/downloads/1000-web-apps.pdf`,
  "Ultimate Web Development Bundle": `${SITE_BASE}/downloads/ultimate-web-bundle.pdf`,
  "Ultimate Mega Bundle": `${SITE_BASE}/downloads/mega-bundle.pdf`,
  "Web Applications Collection": `${SITE_BASE}/downloads/web-apps-collection.pdf`,
};

async function fullSync() {
  console.log("🔄 Full Download URL Sync\n");

  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, download_url");

  if (error) { console.error("❌ Fetch failed:", error.message); return; }

  let updated = 0;
  let skipped = 0;

  for (const product of products ?? []) {
    const url = urlMap[product.name];
    if (!url) { console.log(`⏭️  No mapping for: ${product.name}`); skipped++; continue; }

    const { error: dbErr } = await supabase
      .from("products")
      .update({ download_url: url })
      .eq("id", product.id);

    if (dbErr) {
      console.error(`❌ ${product.name}: ${dbErr.message}`);
    } else {
      console.log(`✅ ${product.name}`);
      updated++;
    }
  }

  console.log(`\n🏁 Done. Updated: ${updated} | Skipped: ${skipped}`);
}

fullSync().catch(console.error);
