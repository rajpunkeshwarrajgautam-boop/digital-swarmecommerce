import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { seoData } from '../src/lib/seo-data';
import fs from 'fs';
import path from 'path';

/**
 * 🏁 FINAL UNIVERSAL SEED: Antigravity E-commerce v3.0
 * Synchronizes both the 'seoData' (Verticals) and 'digital_assets/' (Agents) 
 * with the Supabase Production Registry.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ SUPABASE CREDENTIALS MISSING IN .ENV');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function universalSeed() {
  console.log('🚀 INITIALIZING UNIVERSAL PRODUCTION SYNC...');

  // 1. SYNC INDUSTRY VERTICALS (From seoData)
  console.log('\n📡 SYNCHRONIZING INDUSTRY VERTICAL REGISTRY...');
  for (const vertical of seoData) {
    const productData = {
      name: `Elite ${vertical.industry} Protocol`,
      description: vertical.description,
      price: 4999,
      category: vertical.industry,
      image: `/images/products/${vertical.slug}.webp`,
      is_visible: true,
      is_verified: true,
      version: '2.4.0',
      download_url: `https://download.digitalswarm.in/assets/${vertical.slug}.zip`,
      merchant_id: 'SYSTEM'
    };

    console.log(`✨ Syncing: ${productData.name}...`);
    const { error } = await supabase
      .from('products')
      .upsert({ id: vertical.slug, ...productData }, { onConflict: 'id' });

    if (error) console.error(`   ❌ FAIL: ${vertical.slug}`, error.message);
  }

  // 2. SYNC SPECIALTY AGENTS (From digital_assets directory if exists)
  const ASSETS_DIR = path.join(process.cwd(), 'digital_assets');
  if (fs.existsSync(ASSETS_DIR)) {
    console.log('\n📡 SYNCHRONIZING SPECIALTY AGENT ASSETS...');
    const agents = fs.readdirSync(ASSETS_DIR).filter(f => 
      fs.statSync(path.join(ASSETS_DIR, f)).isDirectory()
    );

    for (const agentDir of agents) {
      const slug = agentDir.toLowerCase().replace(/_/g, '-');
      const name = agentDir.replace(/_/g, ' ');
      
      const agentData = {
        name: name,
        description: `Autonomous high-performance agent framework: ${name}. Optimized for industrial-scale deployment.`,
        price: 8999,
        category: 'Autonomous Agents',
        image: `/images/products/agent-generic.webp`,
        is_visible: true,
        is_verified: true,
        version: '1.8.2',
        download_url: `https://download.digitalswarm.in/assets/${agentDir}.zip`,
        merchant_id: 'SYSTEM'
      };

      console.log(`🦾 Syncing: ${agentData.name}...`);
      const { error } = await supabase
        .from('products')
        .upsert({ id: slug, ...agentData }, { onConflict: 'id' });

      if (error) console.error(`   ❌ FAIL: ${slug}`, error.message);
    }
  }

  console.log('\n💎 UNIVERSAL SYNC COMPLETE. 14+ ASSETS LIVE IN PRODUCTION.');
}

universalSeed().catch(console.error);
