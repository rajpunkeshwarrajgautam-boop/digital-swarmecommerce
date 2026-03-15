import { createClient } from "@supabase/supabase-js";
import { products } from "./src/lib/data";
import * as dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function sync() {
  console.log("🚀 Starting Database Sync...");
  
  const catalog = products.map(p => ({
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category,
    image: p.image,
    in_stock: p.inStock,
    rating: p.rating,
    features: p.features,
    specs: p.specs,
    install_guide: p.installGuide,
    download_url: p.downloadUrl,
  }));

  for (const product of catalog) {
    const { data: existing } = await supabase
      .from('products')
      .select('id, name')
      .eq('name', product.name)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('products')
        .update(product)
        .eq('id', existing.id);
      
      if (error) console.error(`❌ Failed to update ${product.name}:`, error.message);
      else console.log(`✅ Updated ${product.name}`);
    } else {
      const { error } = await supabase
        .from('products')
        .insert(product);
      
      if (error) console.error(`❌ Failed to insert ${product.name}:`, error.message);
      else console.log(`✨ Inserted ${product.name}`);
    }
  }
  
  console.log("🏁 Sync Completed!");
}

sync();
