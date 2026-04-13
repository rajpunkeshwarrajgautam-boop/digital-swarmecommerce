/**
 * Create public Supabase Storage buckets on the project in .env if missing.
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * Buckets: product-downloads (ZIP fulfillment), review-media (review images)
 */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env / .env.local");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const buckets = [
  { name: "product-downloads", fileSizeLimit: 52428800 },
  { name: "review-media", fileSizeLimit: 5242880 },
];

async function main() {
  const { data: existing, error: listErr } = await supabase.storage.listBuckets();
  if (listErr) {
    console.error("listBuckets:", listErr.message);
    process.exit(1);
  }
  const names = new Set((existing ?? []).map((b) => b.name));

  for (const b of buckets) {
    if (names.has(b.name)) {
      console.log(`OK  bucket exists: ${b.name}`);
      continue;
    }
    const { error } = await supabase.storage.createBucket(b.name, {
      public: true,
      fileSizeLimit: b.fileSizeLimit,
    });
    if (error) {
      console.error(`FAIL create ${b.name}:`, error.message);
      process.exit(1);
    }
    console.log(`OK  created bucket: ${b.name} (public)`);
  }
}

main();
