import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "..", "public", "images", "products", "heroes");
fs.mkdirSync(dir, { recursive: true });

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** [id, title line, fulfillment tag — honest, not a screenshot claim] */
const rows = [
  ["notion-crm-protocol", "The Ultimate Freelancer CRM", "NOTION — DUPLICATE LINK ON DELIVERY PAGE"],
  ["ai-social-automation", "AI Social Poster Blueprint", "HTML WALKTHROUGH — BYO MAKE + LLM"],
  ["cyberpunk-ui-kit", "Cyberpunk UI Kit Pro", "FIGMA COMMUNITY — DUPLICATE FROM DELIVERY"],
  ["ai-executive-playbook", "The AI Executive Playbook", "MARKDOWN + CHECKLISTS — NO BUNDLED PDF"],
  ["ai-for-lawyers", "Elite Legal Protocol", "HTML + PROMPT CORE — DRAFT FOR COUNSEL REVIEW"],
  ["ai-for-real-estate", "Elite Real Estate Protocol", "HTML + PROMPT CORE — AUTOMATION BYO"],
  ["ai-for-finance", "Elite Finance Protocol", "HTML + PROMPT CORE — YOUR DATA IN LLM"],
  ["ai-for-healthcare", "Elite Healthcare Protocol", "HTML + PROMPT CORE — CLINICAL REVIEW REQUIRED"],
  ["ai-for-marketing", "Elite Digital Marketing Protocol", "HTML + PROMPT CORE — SHEETS ARE YOURS"],
  ["ai-for-copywriting", "Elite Copywriting Protocol", "HTML + PROMPT CORE — LLM OUTPUTS"],
  ["ai-for-saas", "Elite SaaS Protocol", "HTML + PROMPT CORE — CHECKLISTS WHEN LINKED"],
  ["ai-for-ecommerce", "Elite E-commerce Protocol", "HTML + PROMPT CORE — AUTOMATION BYO"],
  ["sentinel-research-infiltrator", "Sentinel Research Infiltrator", "HTML + PROMPT CORE — AUTOMATION BYO"],
  ["cinema-infiltrator", "Swarm Cinema Infiltrator", "HTML + PROMPT CORE — DISTRIBUTION BYO"],
  ["finance-infiltrator", "Swarm Finance Agent", "HTML + PROMPT CORE — NO BUNDLED CODE"],
  ["sales-infiltrator", "Swarm Sales Infiltrator", "HTML + PROMPT CORE — OUTBOUND BYO"],
  ["ai-for-recruitment", "Elite Recruitment Protocol", "HTML + PROMPT CORE — ATS / LINKEDIN BYO"],
  ["ai-for-home-services", "Elite Home Services Protocol", "HTML + PROMPT CORE — FIELD STACK BYO"],
  ["starter-kit", "Digital Swarm Starter Kit", "VERIFIED ZIP — MARKDOWN + CHECKLISTS"],
  ["nextjs-saas-kit", "Digital Swarm Professional Kit", "ZIP + TSX SAMPLE — SAME PROMPT CORE"],
];

for (const [id, title, sub] of rows) {
  const t = esc(title.length > 46 ? `${title.slice(0, 44)}…` : title);
  const s = esc(sub);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800" role="img" aria-label="Catalog cover for ${esc(id)}">
  <rect width="800" height="800" fill="#0a0a0f"/>
  <rect x="32" y="32" width="736" height="736" fill="none" stroke="#ff6b35" stroke-width="3" opacity="0.55"/>
  <text x="400" y="320" text-anchor="middle" fill="#ffffff" font-family="ui-sans-serif,system-ui,sans-serif" font-size="32" font-weight="800">${t}</text>
  <text x="400" y="390" text-anchor="middle" fill="#ff6b35" font-family="ui-monospace,monospace" font-size="15" font-weight="700">${s}</text>
  <text x="400" y="460" text-anchor="middle" fill="#888888" font-family="ui-monospace,monospace" font-size="13">CATALOG COVER ART — NOT A TOOL SCREENSHOT</text>
  <text x="400" y="490" text-anchor="middle" fill="#666666" font-family="ui-monospace,monospace" font-size="12">digitalswarm.in — fulfillment via delivery URL</text>
</svg>
`;
  fs.writeFileSync(path.join(dir, `${id}.svg`), svg, "utf8");
}

console.log(`Wrote ${rows.length} SVGs to ${dir}`);
