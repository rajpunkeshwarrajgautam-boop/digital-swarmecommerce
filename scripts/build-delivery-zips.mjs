/**
 * Builds starter-kit.zip + pro-kit.zip from real files in public/downloads.
 * Run: node scripts/build-delivery-zips.mjs
 */
import { copyFileSync, mkdirSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dl = join(root, "public", "downloads");
const stageRoot = join(root, "scripts", ".staging");

const STARTER_README = `Digital Swarm — Starter Kit (licensed ZIP)
===============================================

This archive is the on-disk fulfillment for the "Digital Swarm Starter Kit" SKU.

CONTENTS
--------
- swarm-paid-prompt-core.md   → Master prompt library (sections 0–14).
- ai-prompt-library.txt       → Compact prompt snippets (overlaps with the .md).
- saas-launch-checklist.txt   → Launch sequencing checklist.
- saas-tech-stack-audit.txt   → Stack / vendor audit prompts.
- design-system-tokens.css    → Neutral CSS variables for quick UI mocks.

HOW TO USE
-----------
1. Unzip anywhere on your machine.
2. Open swarm-paid-prompt-core.md in your editor.
3. Copy prompts into ChatGPT / Claude with your real business context.

Support: support@digitalswarm.in — subject [STARTER KIT]
`;

const PRO_README = `Digital Swarm — Professional Kit (licensed ZIP)
===============================================

Everything in the Starter Kit PLUS:

- cyberpunk-mini-ui-kit.tsx   → Sample React/Tailwind module you can adapt (not a full app repo).

This archive fulfills the "Digital Swarm Professional Kit" SKU. It is intentionally
focused on prompts + checklists + a UI sample — not a dump of proprietary production source.

Support: support@digitalswarm.in — subject [PRO KIT]
`;

function zipDir(srcDir, outZip) {
  if (existsSync(outZip)) rmSync(outZip);
  if (process.platform === "win32") {
    const src = srcDir.replace(/'/g, "''");
    const dst = outZip.replace(/'/g, "''");
    execSync(
      `powershell -NoProfile -Command "Compress-Archive -LiteralPath (Get-ChildItem -LiteralPath '${src}' | ForEach-Object { $_.FullName }) -DestinationPath '${dst}' -Force"`,
      { stdio: "inherit" },
    );
  } else {
    execSync(`cd "${srcDir}" && zip -r "${outZip}" .`, { stdio: "inherit" });
  }
}

function build(name, readme, extraFiles) {
  const dir = join(stageRoot, name);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "READ_ME_FIRST.txt"), readme, "utf8");
  const base = [
    "swarm-paid-prompt-core.md",
    "ai-prompt-library.txt",
    "saas-launch-checklist.txt",
    "saas-tech-stack-audit.txt",
    "design-system-tokens.css",
  ];
  for (const f of [...base, ...extraFiles]) {
    copyFileSync(join(dl, f), join(dir, f));
  }
  zipDir(dir, join(dl, `${name}.zip`));
  console.log("wrote", join(dl, `${name}.zip`));
}

rmSync(stageRoot, { recursive: true, force: true });
mkdirSync(stageRoot, { recursive: true });

build("starter-kit", STARTER_README, []);
build("pro-kit", PRO_README, ["cyberpunk-mini-ui-kit.tsx"]);

rmSync(stageRoot, { recursive: true, force: true });
console.log("done");
