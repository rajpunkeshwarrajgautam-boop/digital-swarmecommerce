import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
// Use relative path with .ts extension for ESM resolution compatibility if needed
import { products } from '../src/lib/data.ts';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedProducts() {
  console.log(`[VAULT_SECURE] Initiating Product Sync to Supabase...`);

  // We will map over the data.ts products and upsert them
  const records = products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category,
    image: p.image,
    in_stock: p.inStock,
    rating: p.rating,
    features: p.features || [],
    specs: p.specs || {},
    install_guide: p.installGuide || '',
    download_url: p.downloadUrl || '',
    merchant_id: p.merchantId || 'SYSTEM',
    is_verified: p.isVerified ?? true,
    // Add additional fields if they exist in schema, else ignore
  }));

  console.log(`Prepared ${records.length} products for upsert.`);

  const { data, error } = await supabase
    .from('products')
    .upsert(records, { onConflict: 'id' });

  if (error) {
    console.error("❌ Failed to sync products:", error.message);
  } else {
    console.log("✅ Successfully synced all products to Supabase.");
  }
}

seedProducts().catch(console.error);
