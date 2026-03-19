import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET = "product-downloads";

// Maps product name keyword → Supabase public URL
const updates = [
  {
    nameKeyword: "Sales Infiltrator",
    url: "https://xbjdosyqgznveddlyiqh.supabase.co/storage/v1/object/public/product-downloads/swarm-sales-infiltrator/swarm-sales-infiltrator.zip",
  },
  {
    nameKeyword: "Finance Oracle",
    url: "https://xbjdosyqgznveddlyiqh.supabase.co/storage/v1/object/public/product-downloads/swarm-finance-oracle/swarm-finance-oracle.zip",
  },
  {
    nameKeyword: "Legal Architect",
    url: "https://xbjdosyqgznveddlyiqh.supabase.co/storage/v1/object/public/product-downloads/swarm-legal-architect/swarm-legal-architect.zip",
  },
  {
    nameKeyword: "Recruitment Command",
    url: "https://xbjdosyqgznveddlyiqh.supabase.co/storage/v1/object/public/product-downloads/swarm-recruitment-command/swarm-recruitment-command.zip",
  },
  {
    nameKeyword: "Trend Oracle",
    url: "https://xbjdosyqgznveddlyiqh.supabase.co/storage/v1/object/public/product-downloads/swarm-trend-oracle/swarm-trend-oracle.zip",
  },
  {
    nameKeyword: "Property Infiltrator",
    url: "https://xbjdosyqgznveddlyiqh.supabase.co/storage/v1/object/public/product-downloads/swarm-property-infiltrator/swarm-property-infiltrator.zip",
  },
  {
    nameKeyword: "Capital",
    url: "https://xbjdosyqgznveddlyiqh.supabase.co/storage/v1/object/public/product-downloads/swarm-capital-oracle/swarm-capital-oracle.zip",
  },
];

async function updateDownloadUrls() {
  console.log("🔍 Fetching all products from DB...\n");

  const { data: allProducts, error: fetchError } = await supabase
    .from("products")
    .select("id, name, download_url");

  if (fetchError) {
    console.error("❌ Failed to fetch products:", fetchError.message);
    return;
  }

  console.log(`Found ${allProducts?.length ?? 0} products:\n`);
  allProducts?.forEach((p) => console.log(`  [${p.id}] ${p.name}`));
  console.log();

  for (const update of updates) {
    const match = allProducts?.find((p) =>
      p.name?.toLowerCase().includes(update.nameKeyword.toLowerCase())
    );

    if (!match) {
      console.warn(`⚠️  No product found matching: "${update.nameKeyword}"`);
      continue;
    }

    const { error } = await supabase
      .from("products")
      .update({ download_url: update.url })
      .eq("id", match.id);

    if (error) {
      console.error(`❌ Failed to update ${match.name}: ${error.message}`);
    } else {
      console.log(`✅ ${match.name}`);
      console.log(`   → ${update.url}\n`);
    }
  }

  console.log("🏁 Download URL sync complete!");
}

updateDownloadUrls().catch(console.error);
