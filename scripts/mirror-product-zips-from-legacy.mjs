/**
 * Copy the 7 public product ZIPs from the legacy Supabase project into the
 * current project (digital-swarm). Run after: npm run storage:ensure-buckets
 *
 * Source: legacy project where files already exist (read-only public GET).
 * Dest:  NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const LEGACY_PUBLIC_BASE =
  "https://xbjdosyqgznveddlyiqh.supabase.co/storage/v1/object/public/product-downloads";

/** Paths under product-downloads/ (same layout both sides) */
const OBJECT_PATHS = [
  "swarm-sales-infiltrator/swarm-sales-infiltrator.zip",
  "swarm-finance-oracle/swarm-finance-oracle.zip",
  "swarm-legal-architect/swarm-legal-architect.zip",
  "swarm-recruitment-command/swarm-recruitment-command.zip",
  "swarm-trend-oracle/swarm-trend-oracle.zip",
  "swarm-property-infiltrator/swarm-property-infiltrator.zip",
  "swarm-capital-oracle/swarm-capital-oracle.zip",
];

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (buckets?.some((b) => b.name === "product-downloads")) return;
  const { error } = await supabase.storage.createBucket("product-downloads", {
    public: true,
    fileSizeLimit: 52428800,
  });
  if (error) throw new Error(`createBucket: ${error.message}`);
}

async function main() {
  if (url.includes("xbjdosyqgznveddlyiqh")) {
    console.warn(
      "\n⚠️  NEXT_PUBLIC_SUPABASE_URL points at the legacy project. Files would be copied to the same host.\n" +
        "   Set URL + SUPABASE_SERVICE_ROLE_KEY to digital-swarm (uhswclj…), e.g.:\n" +
        "   node --env-file=.env.vercel.production scripts/mirror-product-zips-from-legacy.mjs\n"
    );
  }
  await ensureBucket();
  console.log(`Mirroring ${OBJECT_PATHS.length} objects → ${url}\n`);

  for (const path of OBJECT_PATHS) {
    const src = `${LEGACY_PUBLIC_BASE}/${path}`;
    const res = await fetch(src);
    if (!res.ok) {
      console.error(`SKIP ${path}: legacy GET ${res.status}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const { error } = await supabase.storage
      .from("product-downloads")
      .upload(path, buf, {
        contentType: "application/zip",
        upsert: true,
      });
    if (error) {
      console.error(`FAIL ${path}:`, error.message);
    } else {
      console.log(`OK  ${path} (${(buf.length / 1024 / 1024).toFixed(2)} MB)`);
    }
  }
  console.log("\nDone. Optionally run: npx tsx full-url-sync.ts (with .env) to refresh products.download_url");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
