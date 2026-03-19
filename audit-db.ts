import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function auditDB() {
  console.log("🔍 SUPABASE DATABASE AUDIT\n");
  console.log("=".repeat(60));

  // 1. Check all AI Agent products and their download_url
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, category, price, download_url, in_stock")
    .order("name");

  if (error) {
    console.error("❌ Failed to fetch:", error.message);
    return;
  }

  const aiAgents = products?.filter((p) =>
    p.category?.toLowerCase().includes("agent") ||
    p.name?.toLowerCase().includes("swarm") ||
    p.name?.toLowerCase().includes("sentinel")
  );

  console.log("\n📦 AI AGENT PRODUCTS:\n");
  let missingUrls = 0;
  for (const p of aiAgents ?? []) {
    const hasUrl = p.download_url && p.download_url.startsWith("http");
    const urlStatus = hasUrl ? "✅" : "❌ MISSING";
    if (!hasUrl) missingUrls++;
    console.log(`${urlStatus} ${p.name}`);
    console.log(`   Price: ₹${p.price} | In Stock: ${p.in_stock}`);
    if (hasUrl) console.log(`   URL: ${p.download_url}`);
    console.log();
  }

  // 2. Check storage bucket
  console.log("=".repeat(60));
  console.log("\n📁 SUPABASE STORAGE BUCKET:\n");
  const { data: buckets } = await supabase.storage.listBuckets();
  const productBucket = buckets?.find((b) => b.name === "product-downloads");
  if (productBucket) {
    console.log(`✅ Bucket 'product-downloads' exists (public: ${productBucket.public})`);
    const { data: files } = await supabase.storage.from("product-downloads").list("", { limit: 50, offset: 0 });
    console.log(`   Folders in bucket: ${files?.length ?? 0}`);
    files?.forEach((f) => console.log(`   📁 ${f.name}`));
  } else {
    console.log("❌ Bucket 'product-downloads' NOT FOUND");
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log(`\n${missingUrls === 0 ? "✅ ALL PRODUCTS" : `⚠️  ${missingUrls} PRODUCTS`} have download URLs configured.`);
  console.log(`📊 Total AI Agent Products: ${aiAgents?.length}`);
  console.log(`📊 Total Products in DB: ${products?.length}`);
}

auditDB().catch(console.error);
