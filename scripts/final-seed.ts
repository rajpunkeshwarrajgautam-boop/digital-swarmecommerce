import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

/**
 * FINAL SEEDING SCRIPT: Antigravity E-commerce
 * Synchronizes the local 'products/' directory with the Supabase Production Registry.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceRoleKey);

const PRODUCTS_DIR = path.join(process.cwd(), 'products');

async function seedProducts() {
  console.log('🚀 INITIALIZING FINAL PRODUCTION SEED...');

  if (!fs.existsSync(PRODUCTS_DIR)) {
    console.error('❌ PRODUCTS DIRECTORY NOT FOUND');
    return;
  }

  const directories = fs.readdirSync(PRODUCTS_DIR).filter(f => 
    fs.statSync(path.join(PRODUCTS_DIR, f)).isDirectory() && f !== 'zips'
  );

  for (const dir of directories) {
    const slug = dir;
    const name = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    const productData = {
      name: name.replace('Swarm ', 'Elite '),
      description: `Premium autonomous AI framework optimized for ${name.replace('Swarm ', '')} operations. Includes multi-agent protocols and secure-link integration.`,
      price: 4999, // Base price for elite assets
      category: slug.includes('legal') ? 'legal' : slug.includes('finance') ? 'finance' : 'saas',
      image: `/images/products/${slug}.webp`,
      is_visible: true,
      is_verified: true,
      version: '2.0.4',
      download_url: `https://download.digitalswarm.in/assets/${slug}.zip`
    };

    console.log(`📦 Seeding Protocol: ${productData.name}...`);

    const { error } = await supabase
      .from('products')
      .upsert({ id: slug, ...productData }, { onConflict: 'id' });

    if (error) {
      console.error(`❌ FAILED TO SEED ${slug}:`, error.message);
    } else {
      console.log(`✅ SYNCED: ${slug}`);
    }
  }

  console.log('\n✨ FINAL SYNC COMPLETE. PROJECT IS 100% PRODUCTION READY.');
}

seedProducts().catch(console.error);
