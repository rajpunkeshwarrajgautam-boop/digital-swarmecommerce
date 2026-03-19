import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET = "product-downloads";
const ZIPS_DIR = path.join("d:", "AI AGENT", "products", "zips");

// Map zip filename → product ID in DB
const products = [
  { zip: "swarm-sales-infiltrator.zip",    id: "swarm-sales",       dbPath: "swarm-sales-infiltrator/swarm-sales-infiltrator.zip" },
  { zip: "swarm-finance-oracle.zip",       id: "swarm-finance",     dbPath: "swarm-finance-oracle/swarm-finance-oracle.zip" },
  { zip: "swarm-legal-architect.zip",      id: "swarm-legal",       dbPath: "swarm-legal-architect/swarm-legal-architect.zip" },
  { zip: "swarm-recruitment-command.zip",  id: "swarm-recruitment", dbPath: "swarm-recruitment-command/swarm-recruitment-command.zip" },
  { zip: "swarm-trend-oracle.zip",         id: "swarm-trends",      dbPath: "swarm-trend-oracle/swarm-trend-oracle.zip" },
  { zip: "swarm-property-infiltrator.zip", id: "swarm-property",    dbPath: "swarm-property-infiltrator/swarm-property-infiltrator.zip" },
  { zip: "swarm-capital-oracle.zip",       id: "swarm-capital",     dbPath: "swarm-capital-oracle/swarm-capital-oracle.zip" },
];

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET);
  if (!exists) {
    const { error } = await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 52428800, // 50MB
    });
    if (error) throw new Error(`Failed to create bucket: ${error.message}`);
    console.log(`✅ Bucket '${BUCKET}' created`);
  } else {
    console.log(`📦 Bucket '${BUCKET}' already exists`);
  }
}

async function uploadAndUpdateDB() {
  await ensureBucket();

  for (const product of products) {
    const zipPath = path.join(ZIPS_DIR, product.zip);

    if (!fs.existsSync(zipPath)) {
      console.error(`❌ ZIP not found: ${zipPath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(zipPath);
    const fileSizeMB = (fileBuffer.byteLength / 1024 / 1024).toFixed(2);

    console.log(`\n⬆️  Uploading ${product.zip} (${fileSizeMB} MB)...`);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(product.dbPath, fileBuffer, {
        contentType: "application/zip",
        upsert: true,
      });

    if (uploadError) {
      console.error(`❌ Upload failed for ${product.zip}: ${uploadError.message}`);
      continue;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(product.dbPath);

    const publicUrl = urlData.publicUrl;
    console.log(`   URL: ${publicUrl}`);

    // Update DB: products table downloadUrl
    const { error: dbError } = await supabase
      .from("products")
      .update({ download_url: publicUrl })
      .eq("id", product.id);

    if (dbError) {
      // Try slug match as fallback
      const { error: dbError2 } = await supabase
        .from("products")
        .update({ download_url: publicUrl })
        .ilike("slug", `%${product.id}%`);

      if (dbError2) {
        console.warn(`   ⚠️  DB update failed (id: ${product.id}): ${dbError.message}`);
      } else {
        console.log(`   ✅ DB updated via slug match`);
      }
    } else {
      console.log(`   ✅ DB updated (id: ${product.id})`);
    }
  }

  console.log("\n🏁 Upload & DB sync complete!");
}

uploadAndUpdateDB().catch(console.error);
