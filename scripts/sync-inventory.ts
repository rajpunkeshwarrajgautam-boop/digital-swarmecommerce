import { createClient } from "@supabase/supabase-js";
import { products } from "../src/lib/data";
import * as dotenv from "dotenv";

dotenv.config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ MISSING_CREDENTIALS: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

/** Columns safe for typical `products` tables (UUID ids; optional columns omitted). */
function toDbPayload(product: (typeof products)[number]) {
  return {
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    image: product.image,
    in_stock: product.inStock,
    rating: product.rating,
    features: product.features || [],
    specs: product.specs || {},
    download_url: product.downloadUrl || null,
  };
}

async function syncInventory() {
  console.log("🚀 START_SYNC: Orchestrating Digital Swarm Inventory...");
  console.log(`📦 Found ${products.length} products in local catalog (data.ts)`);

  for (const product of products) {
    console.log(`\n🔍 PROCESSING: [${product.id}] ${product.name}`);

    const payload = toDbPayload(product);

    const { data: existing, error: lookupError } = await supabase
      .from("products")
      .select("id")
      .eq("name", product.name)
      .maybeSingle();

    if (lookupError) {
      console.error(`   ❌ LOOKUP_FAILED: ${lookupError.message}`);
      continue;
    }

    if (existing?.id) {
      const { error } = await supabase.from("products").update(payload).eq("id", existing.id);
      if (error) {
        console.error(`   ❌ UPDATE_FAILED: ${error.message}`);
      } else {
        console.log(`   ✅ UPDATED: ${product.name}`);
      }
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) {
        console.error(`   ❌ INSERT_FAILED: ${error.message}`);
      } else {
        console.log(`   ✅ INSERTED: ${product.name}`);
      }
    }
  }

  console.log("\n🏁 SYNC_COMPLETE: Inventory is now hardened in Supabase.");
}

syncInventory().catch((err) => {
  console.error("💥 CRITICAL_ERROR during sync:", err);
  process.exit(1);
});
