import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { currentUser } from '@clerk/nextjs/server';

/**
 * POST /api/products/seed
 * 
 * Admin-only. Seeds the full Digital Swarm product catalog into Supabase.
 * Only runs if the DB is empty. Use /api/products/sync for updates.
 */

const seedProducts = [
  {
    name: 'Sentinel Research Infiltrator (AI Agent)',
    description: 'An autonomous deep-research AI agent. Give it a topic and it infiltrates the surface and deep web to synthesize a professional intelligence report — automatically.\n\n🚀 SETUP GUIDE:\n1. Requires Python 3.10+\n2. Install: pip install -r requirements.txt\n3. Add OPENAI_API_KEY + FIRECRAWL_API_KEY to .env\n4. Run: python sentinel_researcher.py',
    price: 1000.00,
    category: 'AI Agents',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60',
    in_stock: true,
    rating: 5.0,
    features: ['Autonomous Deep Web Scrape', 'Dual-Agent Synthesis Architecture', 'Cyberpunk Streamlit UI', 'OpenAI Agents SDK', 'Full Source Code Included'],
    specs: { API: 'OpenAI, Firecrawl', Format: 'Python / Source', License: 'Master Resell Rights (MRR)', Support: 'Documentation Provided', Components: '2 Agents + UI' },
    download_url: '/downloads/sentinel-research.zip',
  },
  {
    name: 'Swarm Corporate Growth Team (Multi-Agent)',
    description: 'An elite multi-agent sales intelligence team. Coordinates Lead Infiltrators, Outreach Strategists, and Closing Architects for enterprise-grade sales pipelines.\n\n🚀 SETUP GUIDE:\n1. Requires Python 3.10+, CrewAI / LangChain\n2. Install: pip install -r requirements.txt\n3. Add GEMINI_API_KEY to .env\n4. Run: python agent.py',
    price: 1999.00,
    category: 'AI Agents',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60',
    in_stock: true,
    rating: 5.0,
    features: ['Lead Scoring Engine', 'Multi-Agent Coordination', 'CRM Integration Ready', 'Automated Outreach Workflows', 'Full Source Code Included'],
    specs: { API: 'OpenAI / Claude', Format: 'Python / CrewAI', License: 'Master Resell Rights', Support: 'Priority Support', Components: '3+ Agents' },
    download_url: '/downloads/swarm-sales.zip',
  },
  {
    name: 'Swarm Finance Infiltrator (xAI Oracle)',
    description: 'A high-speed financial market oracle powered by xAI Grok. Synthesizes real-time stock, crypto, and market data into actionable trading intelligence.\n\n🚀 SETUP GUIDE:\n1. Requires Python 3.11, Agno Framework\n2. Install: pip install -r requirements.txt\n3. Add XAI_API_KEY to .env\n4. Run: python src/agents/finance_agent.py',
    price: 2499.00,
    category: 'AI Agents',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=60',
    in_stock: true,
    rating: 5.0,
    features: ['xAI Grok Intelligence', 'Real-time Stock/Crypto Uplink', 'Technical Analysis Engine', 'Market Sentiment Scraping', 'Full Source Code Included'],
    specs: { API: 'xAI, YFinance', Format: 'Python / Agno', License: 'Master Resell Rights', Support: 'Priority Support', Components: 'Finance Oracle' },
    download_url: '/downloads/swarm-finance.zip',
  },
  {
    name: 'Swarm Cinema Infiltrator (AI Movie Producer)',
    description: 'A multi-agent film production engine. Coordinates Script Architects and Talent Oracles to produce movie blueprints and casting strategies using live search data.\n\n🚀 SETUP GUIDE:\n1. Requires Python 3.10, Streamlit, Agno\n2. Install: pip install -r requirements.txt\n3. Add GOOGLE_API_KEY + SERP_API_KEY to .env\n4. Run: streamlit run agent.py',
    price: 2999.00,
    category: 'AI Agents',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=60',
    in_stock: true,
    rating: 5.0,
    features: ['Multi-Agent Film Orchestration', 'Live Talent Scouting (SerpApi)', 'Cyberpunk Narrative Engine', '3-Act Structure Synthesis', 'Full Source Code Included'],
    specs: { API: 'Gemini, SerpApi', Format: 'Python / Agno', License: 'Master Resell Rights', Support: 'Priority Support', Components: 'Script + Casting + Producer' },
    download_url: '/downloads/swarm-cinema.zip',
  },
  {
    name: 'Swarm Browser MCP (Openwork Automation)',
    description: 'An infinite-canvas browser automation agent built on Model Context Protocol. Operates any web interface autonomously from natural language objectives.\n\n🚀 SETUP GUIDE:\n1. Requires Node.js v20+\n2. Install: npm install\n3. Add ANTHROPIC_API_KEY to .env\n4. Run: npm start',
    price: 3499.00,
    category: 'AI Agents',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60',
    in_stock: true,
    rating: 5.0,
    features: ['Infinite Canvas Automation', 'Model Context Protocol (MCP)', 'Vision-based DOM Parsing', 'Headless Chrome Support', 'Full Source Code Included'],
    specs: { API: 'Claude / MCP', Format: 'TypeScript / Node.js', License: 'Master Resell Rights', Support: 'Priority Support', Components: 'MCP Server + Agent' },
    download_url: '/downloads/swarm-browser.zip',
  },
  {
    name: 'Swarm Deep Research Agent (Llama3 Local)',
    description: 'A secure, air-gapped deep research agent. Uses local Llama3 / DeepSeek models via Ollama to crawl and synthesize multi-source data with zero data leakage.\n\n🚀 SETUP GUIDE:\n1. Requires Python 3.11 + Ollama\n2. Install: pip install -r requirements.txt\n3. Start Ollama with Llama 3.1 or DeepSeek\n4. Run: python local_rag_agent.py',
    price: 1499.00,
    category: 'AI Agents',
    image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&auto=format&fit=crop&q=60',
    in_stock: true,
    rating: 4.9,
    features: ['100% Local Inference', 'Air-Gapped Privacy', 'Multi-Source Document Synthesis', 'Agentic RAG Pipeline', 'Full Source Code Included'],
    specs: { API: 'Ollama (Local)', Format: 'Python', License: 'Master Resell Rights', Support: 'Priority Support', Components: 'RAG Pipeline' },
    download_url: '/downloads/swarm-deepres.zip',
  },
  {
    name: 'Swarm Multimodal UI/UX Engine (Nano Banana)',
    description: 'An elite design feedback agent. Takes screenshots or Figma exports and outputs structured CSS code and UX improvement plans instantly.\n\n🚀 SETUP GUIDE:\n1. Requires Python 3.10, Streamlit + Nano Banana\n2. Install: pip install -r requirements.txt\n3. Add GEMINI_API_KEY to .env\n4. Run: streamlit run app.py',
    price: 2799.00,
    category: 'AI Agents',
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=60',
    in_stock: true,
    rating: 4.8,
    features: ['Multimodal Vision Analysis', 'Nano Banana Pro Integration', 'Automated Code Generation', 'Figma to Code Pipeline', 'Full Source Code Included'],
    specs: { API: 'Gemini Vision', Format: 'Python / Streamlit', License: 'Master Resell Rights', Support: 'Priority Support', Components: 'UI/UX Vision Agent' },
    download_url: '/downloads/swarm-uiux.zip',
  },
  {
    name: '1000 Manually Tested Web Applications',
    description: 'A comprehensive collection of 1,000 manually tested web applications, including 20 free premium bonuses. Perfect for developers seeking real-world inspiration and production-ready codebases.',
    price: 200.00,
    category: 'Web Development',
    image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=60',
    in_stock: true,
    rating: 4.8,
    features: ['1,000+ Tested Applications', '20 Premium Bonuses Included', 'Diverse Use Cases', 'Clean Codebase', 'Instant Download'],
    specs: { Format: 'PDF / Source Code', Size: '1.2 GB', License: 'Personal & Commercial Use', Compatibility: 'Universal', Updates: 'Lifetime Access' },
    download_url: '/downloads/1000-web-apps.pdf',
  },
  {
    name: 'Ultimate Web Development Bundle',
    description: 'The ultimate toolkit for web developers — curated templates, scripts, UI kits, and essential resources to ship projects faster.',
    price: 200.00,
    category: 'Bundles',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60',
    in_stock: true,
    rating: 4.9,
    features: ['Premium HTML/CSS Templates', 'High-Quality UI Kits', 'Scripts & Plugins', 'Developer Tools', 'Regular Updates'],
    specs: { Format: 'ZIP / PDF', Components: '500+', Technologies: 'HTML, CSS, JS, React', License: 'Royalty Free', Support: 'Priority Email Support' },
    download_url: '/downloads/ultimate-web-bundle.pdf',
  },
  {
    name: 'Ultimate Mega Bundle',
    description: 'A massive all-in-one collection of digital assets, templates, graphics, and code. Your one-stop shop for premium creative content that ships projects fast.',
    price: 200.00,
    category: 'Bundles',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
    in_stock: true,
    rating: 5.0,
    features: ['5,000+ Assets', 'Diverse Categories', 'High-Resolution Graphics', 'Ready-to-Use Code', 'Exclusive Content'],
    specs: { 'Total Files': '5,000+', Categories: 'Design, Code, Marketing', 'File Types': 'PSD, AI, HTML, PDF', Download: 'Instant Access', Validity: 'Lifetime' },
    download_url: '/downloads/mega-bundle.pdf',
  },
  {
    name: 'Web Applications Collection',
    description: 'A curated selection of 50+ high-quality, functional web apps. Each app is well-documented and easy to customize for your own projects.',
    price: 200.00,
    category: 'Web Development',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60',
    in_stock: true,
    rating: 4.7,
    features: ['50+ Functional Apps', 'Modern Tech Stack', 'Responsive & Accessible', 'Well-Documented', 'Easy to Customise'],
    specs: { 'Apps Included': '50+', Frameworks: 'React, Vue, Angular', Backend: 'Node.js, Python', Database: 'SQL / NoSQL', Deployment: 'Docker Ready' },
    download_url: '/downloads/web-apps-collection.pdf',
  },
];

export async function POST() {
  try {
    // ── Auth guard ──────────────────────────────────────────────────────────
    const user = await currentUser();
    const adminEmail = process.env.ADMIN_EMAIL;
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    if (!user || !adminEmail || userEmail !== adminEmail) {
      return NextResponse.json(
        { message: 'Unauthorized: Admin access required.' },
        { status: 401 }
      );
    }

    // ── Check if already seeded ─────────────────────────────────────────────
    const { data: existing, error: checkError } = await supabaseAdmin
      .from('products')
      .select('id')
      .limit(1);

    if (checkError) {
      return NextResponse.json(
        { message: 'DB check failed: ' + checkError.message },
        { status: 500 }
      );
    }

    if (existing && existing.length > 0) {
      return NextResponse.json({
        message: 'Database already has products. Use POST /api/products/sync to update existing records.',
        alreadySeeded: true,
        tip: 'To force a re-seed, delete all products from Supabase first.',
      });
    }

    // ── Insert full catalog ─────────────────────────────────────────────────
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(seedProducts)
      .select('id, name');

    if (error) {
      return NextResponse.json(
        { message: 'Seed failed: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${data?.length ?? 0} of ${seedProducts.length} products into Supabase.`,
      products: data,
    });

  } catch (err) {
    console.error('[seed] Unexpected error:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
