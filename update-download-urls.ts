import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);


// Maps product ID → Next.js public path
const updates = [
  { id: "ai-social-automation", url: "/downloads/ai-social-protocol.html" },
  { id: "ai-executive-playbook", url: "/downloads/ai-executive-playbook.html" },
  { id: "ai-for-real-estate", url: "/downloads/swarm-property-optimized.html" },
  { id: "ai-for-finance", url: "/downloads/swarm-capital-optimized.html" },
  { id: "ai-for-healthcare", url: "/downloads/swarm-voice.html" },
  { id: "sales-infiltrator", url: "/downloads/swarm-sales-optimized.zip" },
  { id: "ai-for-recruitment", url: "/downloads/swarm-talent-optimized.html" },
  { id: "ai-for-home-services", url: "/downloads/sentinel-voyager.html" },
  { id: "ai-for-marketing", url: "/downloads/sentinel-seo-optimized.html" },
  { id: "notion-crm-protocol", url: "/downloads/notion-crm-protocol.html" },
  { id: "ai-for-lawyers", url: "/downloads/swarm-legal-optimized.html" },
  { id: "cinema-infiltrator", url: "/downloads/swarm-cinema-infiltrator.zip" },
  { id: "ai-for-copywriting", url: "/downloads/swarm-content-architect.html" },
  { id: "ai-for-ecommerce", url: "/downloads/ai-services-agency.html" },
  { id: "finance-infiltrator", url: "/downloads/swarm-finance-agent.zip" },
  { id: "ai-for-saas", url: "/downloads/swarm-uiux-auditor.html" },
  { id: "sentinel-research-infiltrator", url: "/downloads/sentinel-research-infiltrator.zip" },
  { id: "ai-for-video", url: "/downloads/swarm-video-gen.zip" },
  { id: "cyberpunk-ui-kit", url: "/downloads/cyberpunk-ui-protocol.html" },
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

  console.log(`Found ${allProducts?.length ?? 0} products in DB.\n`);

  for (const update of updates) {
    // Robust matching: trim and case-insensitive check
    const match = allProducts?.find(
      (p) => p.id?.trim().toLowerCase() === update.id.trim().toLowerCase()
    );

    if (!match) {
      console.warn(`⚠️  No product found in DB with ID: "${update.id}"`);
      console.log(`   (Available IDs: ${allProducts?.map(p => p.id).join(', ')})`);
      continue;
    }

    const { error } = await supabase
      .from("products")
      .update({ download_url: update.url })
      .eq("id", match.id);

    if (error) {
      console.error(`❌ Failed to update ${match.id}: ${error.message}`);
    } else {
      console.log(`✅ SYNCED: [${match.id}] -> ${update.url}`);
    }
  }

  console.log("\n🏁 Download URL sync complete!");
}

updateDownloadUrls().catch(console.error);
