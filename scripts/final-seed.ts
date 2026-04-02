import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

/**
 * 🏁 ARMORED UNIVERSAL SEED: Antigravity E-commerce v3.1
 * Updated: Included self-contained Industry Registry to prevent ESM path errors.
 */

const seoData = [
  { slug: 'ai-for-lawyers', industry: 'Legal', target: 'Lawyers', description: 'Deploy elite multi-agent AI frameworks to automate doc review, legal research, and client onboarding.' },
  { slug: 'ai-for-real-estate', industry: 'Real Estate', target: 'Real Estate Brokers', description: 'Instantly pre-qualify leads, schedule viewings, and aggregate market pricing with our Real Estate AI system protocol.' },
  { slug: 'ai-for-finance', industry: 'Finance', target: 'Financial Analysts', description: 'Execute high-frequency market research and dynamic portfolio simulations using our autonomous AI node architecture.' },
  { slug: 'ai-for-healthcare', industry: 'Healthcare', target: 'Medical Clinics', description: 'Reduce clinic overhead by 40% with an autonomous agent capable of HIPAA-compliant patient pre-screening.' },
  { slug: 'ai-for-agencies', industry: 'Digital Marketing', target: 'Marketing Agencies', description: 'Scale your agency infinitely. Let our AI architecture generate SEO protocols, draft ad copy, and A/B test funnels 24/7.' },
  { slug: 'ai-for-copywriters', industry: 'Copywriting', target: 'Copywriters', description: 'Never stare at a blank page again. Deploy our autonomous copywriter to synthesize elite conversion tactics on demand.' },
  { slug: 'ai-for-saas', industry: 'SaaS', target: 'SaaS Founders', description: 'Build an autonomous tier-1 tech support agent that integrates directly with your SaaS dashboard to reduce user churn.' },
  { slug: 'ai-for-ecommerce', industry: 'E-commerce', target: 'E-commerce Brands', description: 'Plug an elite AI agent into your Shopify store to dynamically negotiate discounts and rescue abandoned carts.' },
  { slug: 'ai-for-recruiters', industry: 'Recruitment', target: 'HR & Recruiters', description: 'Screen 100,000+ resumes instantly. Our HR agents cross-reference candidate data to identify elite talent automatically.' },
  { slug: 'ai-for-plumbers', industry: 'Home Services', target: 'Service Contractors', description: 'Stop missing calls while on the job. Our AI dispatcher answers questions, provides estimates, and books jobs 24/7.' }
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ SUPABASE CREDENTIALS MISSING IN .ENV');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function universalSeed() {
  console.log('🚀 INITIALIZING ARMORED PRODUCTION SYNC...');

  // 1. SYNC INDUSTRY VERTICALS
  console.log('\n📡 SYNCHRONIZING INDUSTRY VERTICAL REGISTRY...');
  for (const vertical of seoData) {
    const productData = {
      name: `Elite ${vertical.industry} Protocol`,
      description: vertical.description,
      price: 4999,
      category: vertical.industry,
      image: `/images/products/${vertical.slug}.webp`,
      in_stock: true,
      download_url: `https://download.digitalswarm.in/assets/${vertical.slug}.zip`
    };

    console.log(`✨ Syncing: ${productData.name}...`);
    const { error } = await supabase
      .from('products')
      .upsert({ id: vertical.slug, ...productData }, { onConflict: 'id' });

    if (error) console.error(`   ❌ FAIL: ${vertical.slug}`, error.message);
  }

  // 2. SYNC SPECIALTY AGENTS
  const ASSETS_DIR = path.join(process.cwd(), 'digital_assets');
  if (fs.existsSync(ASSETS_DIR)) {
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
        in_stock: true,
        download_url: `https://download.digitalswarm.in/assets/${agentDir}.zip`
      };

      console.log(`🦾 Syncing: ${agentData.name}...`);
      const { error } = await supabase
        .from('products')
        .upsert({ id: slug, ...agentData }, { onConflict: 'id' });

      if (error) console.error(`   ❌ FAIL: ${slug}`, error.message);
    }
  }

  console.log('\n💎 UNIVERSAL SYNC COMPLETE. REGISTRY IS LIVE IN PRODUCTION.');
}

universalSeed().catch(console.error);
