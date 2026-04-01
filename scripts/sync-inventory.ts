import { createClient } from "@supabase/supabase-js";
import { products } from "../src/lib/data";
import * as dotenv from "dotenv";
import { Product } from "../src/lib/types";

dotenv.config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ MISSING_CREDENTIALS: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function syncInventory() {
  console.log("🚀 START_SYNC: Orchestrating Digital Swarm Inventory...");
  console.log(`📦 Found ${products.length} products in local catalog (data.ts)`);

  for (const product of products) {
    console.log(`\n🔍 PROCESSING: [${product.id}] ${product.name}`);

    // Map Product (camelCase) to DB Schema (snake_case)
    const dbProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      in_stock: product.inStock,
      rating: product.rating,
      features: product.features || [],
      specs: product.specs || {},
      install_guide: product.installGuide || null,
      download_url: product.downloadUrl || null,
      merchant_id: product.merchantId || "SYSTEM",
      is_verified: product.isVerified || true,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from("products")
      .upsert(dbProduct, { onConflict: "id" });

    if (error) {
      console.error(`   ❌ SYNC_FAILED: ${error.message}`);
    } else {
      console.log(`   ✅ SYNC_SUCCESS: ${product.name} synchronized.`);
    }
  }

  console.log("\n🏁 SYNC_COMPLETE: Inventory is now hardened in Supabase.");
}

syncInventory().catch((err) => {
  console.error("💥 CRITICAL_ERROR during sync:", err);
  process.exit(1);
});
