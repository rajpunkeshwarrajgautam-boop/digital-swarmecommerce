import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const products = [
  {
    id: "notion-crm-protocol",
    name: "The Ultimate Freelancer CRM",
    description: "Your new operating system. A beautifully customized Notion template designed to automate invoicing, track projects, and centralize client communication in one brutally efficient dashboard.",
    price: 1499,
    original_price: 3899,
    category: "Notion Systems",
    image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=800",
    rating: 5.0,
    features: ['1-Click Duplicate', 'Automated Invoicing', 'Client Client Portals', 'Task Prioritization Matrix', 'Zero Coding Required'],
    specs: { Platform: 'Notion', Level: 'Beginner', Setup: '2 Mins', License: 'Personal', Support: 'Discord' },
    download_url: "/downloads/notion-crm-protocol.html"
  },
  {
    id: "ai-social-automation",
    name: "AI Social Poster Blueprint",
    description: "A plug-and-play Make.com automation blueprint. Watches your content feeds, uses OpenAI to write viral hooks, and posts directly to X and LinkedIn automatically.",
    price: 1999,
    original_price: 4999,
    category: "No-Code Automations",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    rating: 4.9,
    features: ['Make.com Blueprint (.json)', 'OpenAI Integration', 'Auto-posts to X & LinkedIn', 'RSS Feed Watcher', 'Zero Coding Required'],
    specs: { Platform: 'Make.com', API: 'OpenAI', Output: 'Social Media', License: 'Business', Support: 'Documentation' },
    download_url: "/downloads/ai-social-protocol.html"
  },
  {
    id: "cyberpunk-ui-kit",
    name: "Cyberpunk UI Kit Pro",
    description: "100+ high-end, brutalist cyberpunk components ready to be dragged and dropped into your next Figma design. Build stunning futuristic interfaces in minutes.",
    price: 2499,
    original_price: 5999,
    category: "Design Assets",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    rating: 5.0,
    features: ['100+ Figma Components', 'Global Color Variables', 'Auto-Layout Ready', 'Cyberpunk Neon Theme', 'Zero Coding Required'],
    specs: { Format: '.fig', Software: 'Figma', Typography: 'Google Fonts', License: 'Commercial', Support: 'Lifetime' },
    download_url: "/downloads/cyberpunk-ui-protocol.html"
  },
  {
    id: "ai-executive-playbook",
    name: "The AI Executive Playbook",
    description: "A 50-page tactical PDF manifesto detailing exactly how to use ChatGPT and Claude to replace a marketing department, scale lead generation, and automate research.",
    price: 999,
    original_price: 2499,
    category: "Playbooks",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
    rating: 4.8,
    features: ['50-Page PDF Manifesto', '150+ Copy-Paste Prompts', 'Outreach Frameworks', 'Case Studies Included', 'Zero Coding Required'],
    specs: { Format: 'PDF', Length: '50 Pages', Tools: 'ChatGPT/Claude', License: 'Personal', Support: 'Community' },
    download_url: "/downloads/ai-executive-playbook.html"
  },
  {
    id: "ai-for-lawyers",
    name: "Elite Legal Protocol",
    description: "Deploy elite multi-agent AI frameworks to automate doc review, legal research, and client onboarding.",
    price: 12999,
    original_price: 28999,
    category: "Legal",
    image: "/images/products/swarm-legal.png",
    rating: 5.0,
    features: ['Multi-Agent AI', 'Doc Review Automation', 'Legal Research Node', 'Secure Client Onboarding'],
    specs: { Industry: 'Legal', Version: '2.4.0', Deploy: 'Cloud', License: 'Enterprise', Support: 'Priority' },
    download_url: "https://download.digitalswarm.in/assets/ai-for-lawyers.zip"
  },
  {
    id: "ai-for-real-estate",
    name: "Elite Real Estate Protocol",
    description: "Instantly pre-qualify leads, schedule viewings, and aggregate market pricing with our Real Estate AI system protocol.",
    price: 12999,
    original_price: 28999,
    category: "Real Estate",
    image: "/images/products/swarm-property.png",
    rating: 4.9,
    features: ['Lead Pre-qualification', 'Viewing Scheduler', 'Market Pricing Aggregator', 'CRM Integration'],
    specs: { Industry: 'Real Estate', Version: '2.4.0', Deploy: 'Cloud', License: 'Enterprise', Support: 'Priority' },
    download_url: "https://download.digitalswarm.in/assets/ai-for-real-estate.zip"
  },
  {
    id: "ai-for-finance",
    name: "Elite Finance Protocol",
    description: "Execute high-frequency market research and dynamic portfolio simulations using our autonomous AI node architecture.",
    price: 12999,
    original_price: 28999,
    category: "Finance",
    image: "/images/products/swarm-finance.png",
    rating: 5.0,
    features: ['HFT Market Research', 'Portfolio Simulation', 'Autonomous Node Sync', 'Risk Analysis Engine'],
    specs: { Industry: 'Finance', Version: '2.4.0', Deploy: 'On-Prem/Cloud', License: 'Enterprise', Support: 'Priority' },
    download_url: "https://download.digitalswarm.in/assets/ai-for-finance.zip"
  },
  {
    id: "ai-for-healthcare",
    name: "Elite Healthcare Protocol",
    description: "Automate patient data processing, diagnostic assistance, and clinical workflow optimization.",
    price: 12999,
    original_price: 28999,
    category: "Healthcare",
    image: "https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=800",
    rating: 5.0,
    features: ['HIPAA Compliant AI', 'Diagnostic Assistance', 'Workflow Optimization', 'Patient Intelligence'],
    specs: { Industry: 'Healthcare', Version: '2.4.0', Deploy: 'Hybrid', License: 'Enterprise', Support: 'Priority' },
    download_url: "https://download.digitalswarm.in/assets/ai-for-healthcare.zip"
  },
  {
    id: "ai-for-marketing",
    name: "Elite Digital Marketing Protocol",
    description: "Niche-optimized AI for lead generation, content automation, and real-time ad optimization.",
    price: 12999,
    original_price: 28999,
    category: "Digital Marketing",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    rating: 4.9,
    features: ['Lead Generation AI', 'Content Automation', 'Real-time Ad Optimization', 'Predictive Analytics'],
    specs: { Industry: 'Marketing', Version: '2.4.0', Deploy: 'Cloud', License: 'Enterprise', Support: 'Priority' },
    download_url: "https://download.digitalswarm.in/assets/ai-for-marketing.zip"
  },
  {
    id: "ai-for-copywriting",
    name: "Elite Copywriting Protocol",
    description: "Autonomous writing agents engineered for high-conversion sales copy and technical documentation.",
    price: 12999,
    original_price: 28999,
    category: "Copywriting",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800",
    rating: 5.0,
    features: ['Sales Copy AI', 'Technical Doc Writing', 'A/B Testing Automation', 'Style Guide Enforcement'],
    specs: { Industry: 'Copywriting', Version: '2.4.0', Deploy: 'Cloud', License: 'Enterprise', Support: 'Priority' },
    download_url: "https://download.digitalswarm.in/assets/ai-for-copywriting.zip"
  },
  {
    id: "ai-for-saas",
    name: "Elite SaaS Protocol",
    description: "Embedded AI frameworks for predictive churn analysis and autonomous customer success paths.",
    price: 12999,
    original_price: 28999,
    category: "SaaS",
    image: "https://images.unsplash.com/photo-1551288049-bbbda5366991?auto=format&fit=crop&q=80&w=800",
    rating: 5.0,
    features: ['Churn Analysis Engine', 'Customer Success AI', 'LTV Prediction Node', 'Embedded ML Framework'],
    specs: { Industry: 'SaaS', Version: '2.4.0', Deploy: 'SaaS/Cloud', License: 'Enterprise', Support: 'Priority' },
    download_url: "https://download.digitalswarm.in/assets/ai-for-saas.zip"
  },
  {
    id: "ai-for-ecommerce",
    name: "Elite E-commerce Protocol",
    description: "High-performance inventory forecasting, dynamic pricing, and personalized UX agents.",
    price: 12999,
    original_price: 28999,
    category: "E-commerce",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=800",
    rating: 5.0,
    features: ['Inventory Forecasting', 'Dynamic Pricing Engine', 'Personalized UX Agents', 'Checkout Optimization'],
    specs: { Industry: 'E-commerce', Version: '2.4.0', Deploy: 'Edge/Cloud', License: 'Enterprise', Support: 'Priority' },
    download_url: "https://download.digitalswarm.in/assets/ai-for-ecommerce.zip"
  },
  {
    id: "sentinel-research-infiltrator",
    name: "Sentinel Research Infiltrator",
    description: "Deep-web intelligence aggregator for market research and competitive mapping.",
    price: 34999,
    original_price: 79999,
    category: "AI Agent",
    image: "/images/products/sentinel-research.png",
    rating: 5.0,
    features: ['Deep-Web Scraper', 'Competitive Mapping', 'Intelligence Aggregator', 'Shadow Mode Stealth'],
    specs: { Agent: 'Sentinel', Class: 'Research', Speed: 'Extreme', License: 'Elite', Support: '24/7' },
    download_url: "https://download.digitalswarm.in/agents/sentinel-research.zip"
  },
  {
    id: "cinema-infiltrator",
    name: "Swarm Cinema Infiltrator",
    description: "Multi-modal AI for video analysis, script generation, and real-time editing workflows.",
    price: 34999,
    original_price: 79999,
    category: "AI Agent",
    image: "/images/products/swarm-cinema.png",
    rating: 5.0,
    features: ['Video Analysis Node', 'Script Generation AI', 'Real-time Edit Sink', 'CGI Prediction'],
    specs: { Agent: 'Swarm', Class: 'Cinema', Speed: 'Hyper', License: 'Elite', Support: '24/7' },
    download_url: "https://download.digitalswarm.in/agents/cinema-infiltrator.zip"
  },
  {
    id: "finance-infiltrator",
    name: "Swarm Finance Agent",
    description: "Autonomous financial analyst for high-frequency auditing and risk-modeling.",
    price: 34999,
    original_price: 79999,
    category: "AI Agent",
    image: "/images/products/swarm-finance.png",
    rating: 5.0,
    features: ['Audit Automation', 'Risk-Modeling Node', 'Global Compliance Scan', 'Portfolio Prediction'],
    specs: { Agent: 'Swarm', Class: 'Finance', Speed: 'Instant', License: 'Elite', Support: '24/7' },
    download_url: "https://download.digitalswarm.in/agents/finance-agent.zip"
  },
  {
    id: "sales-infiltrator",
    name: "Swarm Sales Infiltrator",
    description: "Lead injection and negotiation AI for autonomous revenue generation.",
    price: 34999,
    original_price: 79999,
    category: "AI Agent",
    image: "/images/products/swarm-sales.png",
    rating: 5.0,
    features: ['Lead Injection Node', 'Negotiation AI', 'Revenue Tracking', 'Social Engineering Assist'],
    specs: { Agent: 'Swarm', Class: 'Sales', Speed: 'Aggressive', License: 'Elite', Support: '24/7' },
    download_url: "https://download.digitalswarm.in/agents/sales-infiltrator.zip"
  },
  {
    id: "ai-for-recruitment",
    name: "Elite Recruitment Protocol",
    description: "Automate talent sourcing, resume screening, and interview scheduling with multi-agent AI.",
    price: 12999,
    original_price: 28999,
    category: "Recruitment",
    image: "/images/products/swarm-talent.png",
    rating: 4.9,
    features: ['Talent Sourcing AI', 'Resume Screening Node', 'Scheduling Automation', 'Culture Fit Analysis'],
    specs: { Industry: 'Recruitment', Version: '2.4.0', Deploy: 'Cloud', License: 'Enterprise', Support: 'Priority' },
    download_url: "https://download.digitalswarm.in/assets/ai-for-recruitment.zip"
  },
  {
    id: "ai-for-home-services",
    name: "Elite Home Services Protocol",
    description: "Dispatch automation, quote generation, and customer portal AI for home service industry leaders.",
    price: 12999,
    original_price: 28999,
    category: "Home Services",
    image: "/images/products/ai-for-home-services.webp",
    rating: 5.0,
    features: ['Dispatch Automation', 'Quote Generation AI', 'Customer Portal Node', 'Live Field Sync'],
    specs: { Industry: 'Home Services', Version: '2.4.0', Deploy: 'Mobile/Cloud', License: 'Enterprise', Support: 'Priority' },
    download_url: "https://download.digitalswarm.in/assets/ai-for-home-services.zip"
  }
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function universalSeed() {
  console.log('🚀 INITIALIZING STRATEGIC PRICING SYNC...');
  
  // 1. PERFORM TACTICAL WIPE (Ensuring absolute data consistency)
  console.log('\n🧨 WIPING EXISTING PRODUCT REGISTRY...');
  await supabase.from('products').delete().neq('id', 'SYSTEM_RESERVED');

  // 2. REPOPULATE WITH LUXURY PRICING TIERS
  console.log('\n📡 SYNCHRONIZING UNIVERSAL ASSET REGISTRY (18 ITEMS)...');
  
  for (const product of products) {
    const productData = {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      in_stock: true,
      rating: product.rating,
      features: product.features,
      specs: product.specs,
      download_url: product.download_url,
      merchant_id: "SYSTEM",
      is_verified: true
    };

    console.log(`✨ Syncing: ${productData.name} - ${productData.price} INR...`);
    const { error } = await supabase
      .from('products')
      .upsert({ id: product.id, ...productData }, { onConflict: 'id' });

    if (error) console.error(`   ❌ FAIL: ${product.id}`, error.message);
  }

  console.log('\n💎 STRATEGIC SYNC COMPLETE. PRICING IS LIVE.');
}

universalSeed().catch(console.error);
