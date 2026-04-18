/**
 * Rewrites paid delivery HTML: replaces "What's Inside" + "Deployment Protocol"
 * blocks with copy that matches real /downloads files (no fake zips).
 * Run: node scripts/truth-delivery-pages.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dl = join(__dirname, "..", "public", "downloads");

const ASSETS = `<a href="/downloads/swarm-paid-prompt-core.md" download style="color:#00F5FF">swarm-paid-prompt-core.md</a>,
            <a href="/downloads/saas-tech-stack-audit.txt" download>saas-tech-stack-audit.txt</a>,
            <a href="/downloads/saas-launch-checklist.txt" download>saas-launch-checklist.txt</a>,
            <a href="/downloads/design-system-tokens.css" download>design-system-tokens.css</a>`;

function grid4(a, b, c, d) {
  return `        <h2>What's Inside Your Package</h2>
        <div class="step">
            <div class="contents-grid">
                <div class="contents-item"><strong>${a}</strong>${b}</div>
                <div class="contents-item"><strong>${c}</strong>${d}</div>
                <div class="contents-item"><strong>SaaS launch checklist</strong>Ship discipline &amp; go-live gates.</div>
                <div class="contents-item"><strong>Stack audit (txt)</strong>Vendor / architecture sanity pass.</div>
            </div>
        </div>`;
}

function splicePackAndDeploy(html, inner) {
  const w = html.indexOf("<h2>What's Inside");
  if (w === -1) throw new Error("missing What's Inside");
  const d = html.indexOf("<h2>Deployment Protocol", w);
  if (d === -1) throw new Error("missing Deployment");
  const top = html.indexOf("<h2>Top Use Cases", d);
  const warn = html.indexOf('<div class="warning">', d);
  let end = top;
  if (warn !== -1 && (top === -1 || warn < top)) end = warn;
  if (end === -1) throw new Error("missing end marker");
  return html.slice(0, w) + inner + html.slice(end);
}

const patches = [
  {
    file: "sentinel-research-optimized.html",
    inner: `${grid4("Master prompt library", "Section 1 — research, intel, teardowns.", "Design tokens (css)", "Prototype intelligence briefs quickly.")}

        <h2>Deployment Protocol — 4 Steps</h2>

        <div class="step">
            <h3>Step 01 — Download licensed files</h3>
            <p>Download ${ASSETS}. The Markdown file is the single source of truth for prompts.</p>
        </div>

        <div class="step">
            <h3>Step 02 — Competitor scan</h3>
            <p>In <strong>Section 1</strong>, run the <em>Competitor teardown</em> prompt with domain + geography. Paste outputs into your workspace (Notion/Docs).</p>
        </div>

        <div class="step">
            <h3>Step 03 — Market map + trends</h3>
            <p>Use <em>Market map</em> and <em>Trend surveillance brief</em> in the same section. Schedule a recurring reminder in <a href="https://make.com" target="_blank">Make.com</a> if you want automation — you build the scenario (no hidden JSON).</p>
        </div>

        <div class="step">
            <h3>Step 04 — Executive packaging</h3>
            <p>Use <strong>Section 14</strong> (Executive) to turn findings into a one-page decision memo for stakeholders.</p>
        </div>

`,
  },
  {
    file: "swarm-legal-optimized.html",
    inner: `${grid4("Master prompt library", "Section 2 — legal workflows & clause passes.", "Honest scope", "No phantom PDF — prompts + checklists live in the .md file.")}

        <h2>Deployment Protocol — 4 Steps</h2>

        <div class="step">
            <h3>Step 01 — Download licensed files</h3>
            <p>Download ${ASSETS}. Primary work happens in <strong>Section 2</strong>.</p>
        </div>

        <div class="step">
            <h3>Step 02 — First contract pass</h3>
            <p>Run <em>Clause risk pass</em> with your clause text and jurisdiction. Iterate with counsel — outputs are drafts, not advice.</p>
        </div>

        <div class="step">
            <h3>Step 03 — Client intake + memos</h3>
            <p>Use <em>Client intake summary</em> and <em>Research memo outline</em> for structured drafts you can file after review.</p>
        </div>

        <div class="step">
            <h3>Step 04 — Optional automation</h3>
            <p>Build Make.com or Zapier flows yourself using exported model outputs — no proprietary blueprint files are bundled.</p>
        </div>

`,
  },
  {
    file: "swarm-property-optimized.html",
    inner: `${grid4("Master prompt library", "Section 3 — listings, CMA, objections.", "Stack + checklist", "Ground marketing ops in shipped txt assets.")}

        <h2>Deployment Protocol — 4 Steps</h2>

        <div class="step">
            <h3>Step 01 — Download licensed files</h3>
            <p>Download ${ASSETS}. Work in <strong>Section 3</strong>.</p>
        </div>

        <div class="step">
            <h3>Step 02 — Listing + social</h3>
            <p>Run <em>Listing description</em> with full property facts.</p>
        </div>

        <div class="step">
            <h3>Step 03 — CMA narrative</h3>
            <p>Paste comps into <em>CMA narrative</em> and refine with your broker standards.</p>
        </div>

        <div class="step">
            <h3>Step 04 — Objection scripts</h3>
            <p>Use <em>Buyer objection handling</em> before calls and showings.</p>
        </div>

`,
  },
  {
    file: "swarm-capital-optimized.html",
    inner: `${grid4("Master prompt library", "Section 4 — finance, risk, board memos.", "Stack audit", "Align models with your data posture.")}

        <h2>Deployment Protocol — 4 Steps</h2>

        <div class="step">
            <h3>Step 01 — Download licensed files</h3>
            <p>Download ${ASSETS}. Work in <strong>Section 4</strong>.</p>
        </div>

        <div class="step">
            <h3>Step 02 — Research snapshot</h3>
            <p>Run <em>Equity research snapshot</em> with tickers and horizon — non-advisory framing stays in the prompt.</p>
        </div>

        <div class="step">
            <h3>Step 03 — Risk narrative</h3>
            <p>Use <em>Risk narrative</em> with portfolio context you paste.</p>
        </div>

        <div class="step">
            <h3>Step 04 — Board skeleton</h3>
            <p>Promote outputs with <em>Board ask / decision memo</em> from Section 14 if needed.</p>
        </div>

`,
  },
  {
    file: "swarm-voice.html",
    inner: `${grid4("Master prompt library", "Section 5 — healthcare drafts + checklist.", "Clinical review", "Every output requires licensed practitioner sign-off.")}

        <h2>Deployment Protocol — 4 Steps</h2>

        <div class="step">
            <h3>Step 01 — Download licensed files</h3>
            <p>Download ${ASSETS}. Work in <strong>Section 5</strong>.</p>
        </div>

        <div class="step">
            <h3>Step 02 — SOAP draft</h3>
            <p>Run <em>SOAP-style draft</em> with facts you supply — no invented vitals.</p>
        </div>

        <div class="step">
            <h3>Step 03 — Patient comms</h3>
            <p>Use <em>Patient comms</em> templates; adapt to your org voice.</p>
        </div>

        <div class="step">
            <h3>Step 04 — AI usage checklist</h3>
            <p>Apply <em>HIPAA-style usage checklist</em> before rolling prompts to staff.</p>
        </div>

`,
  },
  {
    file: "sentinel-seo-optimized.html",
    inner: `${grid4("Master prompt library", "Section 6 — SEO, campaigns, competitor content.", "Launch checklist", "Ship experiments with clear gates.")}

        <h2>Deployment Protocol — 4 Steps</h2>

        <div class="step">
            <h3>Step 01 — Download licensed files</h3>
            <p>Download ${ASSETS}. Work in <strong>Section 6</strong>.</p>
        </div>

        <div class="step">
            <h3>Step 02 — Content gap analysis</h3>
            <p>Run <em>Competitor content gap</em> with real URLs.</p>
        </div>

        <div class="step">
            <h3>Step 03 — Technical SEO list</h3>
            <p>Paste crawl notes into <em>Technical SEO punch list</em>.</p>
        </div>

        <div class="step">
            <h3>Step 04 — Campaign brief</h3>
            <p>Lock messaging with <em>Campaign brief</em> before spend.</p>
        </div>

`,
  },
  {
    file: "swarm-content-architect.html",
    inner: `${grid4("Master prompt library", "Section 7 — copy, emails, VSL beats.", "Tokens (css)", "Keep UI experiments on-brand.")}

        <h2>Deployment Protocol — 4 Steps</h2>

        <div class="step">
            <h3>Step 01 — Download licensed files</h3>
            <p>Download ${ASSETS}. Work in <strong>Section 7</strong>.</p>
        </div>

        <div class="step">
            <h3>Step 02 — Homepage wire</h3>
            <p>Run <em>Homepage wire copy</em> with ICP + proof points.</p>
        </div>

        <div class="step">
            <h3>Step 03 — Cold sequence</h3>
            <p>Use <em>Cold email 3-touch</em> with honest personalization fields.</p>
        </div>

        <div class="step">
            <h3>Step 04 — VSL beat sheet</h3>
            <p>Produce structure with <em>VSL beat sheet</em> before filming.</p>
        </div>

`,
  },
  {
    file: "swarm-uiux-auditor.html",
    inner: `${grid4("Master prompt library", "Section 8 — SaaS churn, activation, NPS.", "Stack audit", "Map prompts to your analytics exports.")}

        <h2>Deployment Protocol — 4 Steps</h2>

        <div class="step">
            <h3>Step 01 — Download licensed files</h3>
            <p>Download ${ASSETS}. Work in <strong>Section 8</strong>.</p>
        </div>

        <div class="step">
            <h3>Step 02 — Churn post-mortem</h3>
            <p>Paste cancellations into <em>Churn post-mortem</em>.</p>
        </div>

        <div class="step">
            <h3>Step 03 — Activation audit</h3>
            <p>Run <em>Activation audit</em> with your funnel metrics.</p>
        </div>

        <div class="step">
            <h3>Step 04 — Detractor replies</h3>
            <p>Use <em>NPS detractor response</em> for save plays.</p>
        </div>

`,
  },
  {
    file: "ai-services-agency.html",
    inner: `${grid4("Master prompt library", "Section 9 — e-commerce, DTC, PDP, carts.", "Checklist + audit", "Operational guardrails for campaigns.")}

        <h2>Deployment Protocol — 4 Steps</h2>

        <div class="step">
            <h3>Step 01 — Download licensed files</h3>
            <p>Download ${ASSETS}. Work in <strong>Section 9</strong>.</p>
        </div>

        <div class="step">
            <h3>Step 02 — PDP + SEO</h3>
            <p>Run <em>PDP + SEO</em> with SKU facts.</p>
        </div>

        <div class="step">
            <h3>Step 03 — Cart recovery</h3>
            <p>Use <em>Abandoned cart sequence</em> with brand voice notes.</p>
        </div>

        <div class="step">
            <h3>Step 04 — Influencer outreach</h3>
            <p>Generate <em>Influencer outreach</em> kits with your offer.</p>
        </div>

`,
  },
  {
    file: "swarm-cinema.html",
    inner: `${grid4("Master prompt library", "Section 11 — scripts, shots, YouTube packaging.", "Tokens (css)", "Style guides for storyboards.")}

        <h2>Deployment Protocol — 4 Steps</h2>

        <div class="step">
            <h3>Step 01 — Download licensed files</h3>
            <p>Download ${ASSETS}. Work in <strong>Section 11</strong>.</p>
        </div>

        <div class="step">
            <h3>Step 02 — Beat outline</h3>
            <p>Run <em>Script beat outline</em> with format + audience.</p>
        </div>

        <div class="step">
            <h3>Step 03 — Shot list</h3>
            <p>Feed script excerpts to <em>Shot list from script</em>.</p>
        </div>

        <div class="step">
            <h3>Step 04 — Packaging</h3>
            <p>Use <em>YouTube packaging</em> before publish.</p>
        </div>

`,
  },
  {
    file: "swarm-finance-optimized.html",
    inner: `${grid4("Master prompt library", "Section 4 — finance intelligence workflows.", "Stack audit", "Ground numbers you paste from your tools.")}

        <h2>Deployment Protocol — 4 Steps</h2>

        <div class="step">
            <h3>Step 01 — Download licensed files</h3>
            <p>Download ${ASSETS}. Work in <strong>Section 4</strong>.</p>
        </div>

        <div class="step">
            <h3>Step 02 — Research snapshot</h3>
            <p>Run <em>Equity research snapshot</em> with explicit non-advice framing.</p>
        </div>

        <div class="step">
            <h3>Step 03 — Risk narrative</h3>
            <p>Use <em>Risk narrative</em> with portfolio exports.</p>
        </div>

        <div class="step">
            <h3>Step 04 — Board memo</h3>
            <p>Promote to leadership with Section 14 prompts.</p>
        </div>

`,
  },
  {
    file: "swarm-sales-optimized.html",
    inner: `${grid4("Master prompt library", "Section 10 — outbound, research, objections.", "Launch checklist", "Cadence + experiments.")}

        <h2>Deployment Protocol — 4 Steps</h2>

        <div class="step">
            <h3>Step 01 — Download licensed files</h3>
            <p>Download ${ASSETS}. Work in <strong>Section 10</strong>.</p>
        </div>

        <div class="step">
            <h3>Step 02 — Prospect brief</h3>
            <p>Run <em>Prospect research brief</em> per account.</p>
        </div>

        <div class="step">
            <h3>Step 03 — First lines</h3>
            <p>Use <em>Cold email first line batch</em> with real signals only.</p>
        </div>

        <div class="step">
            <h3>Step 04 — Objections</h3>
            <p>Prepare <em>Objection handling</em> talk tracks.</p>
        </div>

`,
  },
  {
    file: "swarm-talent-optimized.html",
    inner: `${grid4("Master prompt library", "Section 12 — JDs, screening, interviews.", "Stack audit", "Align hiring tech with process.")}

        <h2>Deployment Protocol — 4 Steps</h2>

        <div class="step">
            <h3>Step 01 — Download licensed files</h3>
            <p>Download ${ASSETS}. Work in <strong>Section 12</strong>.</p>
        </div>

        <div class="step">
            <h3>Step 02 — JD generation</h3>
            <p>Run <em>JD from intake</em> with must-haves + comp band.</p>
        </div>

        <div class="step">
            <h3>Step 03 — Resume screen</h3>
            <p>Use <em>Resume screen rubric</em> per candidate.</p>
        </div>

        <div class="step">
            <h3>Step 04 — Interview loop</h3>
            <p>Schedule panels with <em>Interview plan</em>.</p>
        </div>

`,
  },
  {
    file: "sentinel-voyager.html",
    inner: `${grid4("Master prompt library", "Section 13 — trades, quotes, reviews, promos.", "Checklist", "Seasonal campaigns with compliance in mind.")}

        <h2>Deployment Protocol — 4 Steps</h2>

        <div class="step">
            <h3>Step 01 — Download licensed files</h3>
            <p>Download ${ASSETS}. Work in <strong>Section 13</strong>.</p>
        </div>

        <div class="step">
            <h3>Step 02 — Itemized quote</h3>
            <p>Run <em>Itemized quote narrative</em> with scope + warranty text you control.</p>
        </div>

        <div class="step">
            <h3>Step 03 — Review requests</h3>
            <p>Use <em>Review request SMS sequence</em> after job closeout.</p>
        </div>

        <div class="step">
            <h3>Step 04 — Seasonal promo</h3>
            <p>Deploy <em>Seasonal promo</em> across email/SMS/social.</p>
        </div>

`,
  },
];

for (const { file, inner } of patches) {
  const path = join(dl, file);
  const html = readFileSync(path, "utf8");
  const next = splicePackAndDeploy(html, inner);
  writeFileSync(path, next, "utf8");
  console.log("patched", file);
}
