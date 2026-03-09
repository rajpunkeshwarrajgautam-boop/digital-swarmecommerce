const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
  {
    name: "1000 Manually Tested Web Applications",
    description: "A comprehensive collection of 1000 manually tested web applications, including 20 free premium bonuses.",
    price: 200,
    category: "Web Development",
    image: "/images/products/1000-web-apps.png",
    in_stock: true,
    rating: 4.8,
    features: ['1000+ Tested Applications', '20 Premium Bonuses', 'Diverse Use Cases', 'Clean Codebase', 'Instant Download'],
    specs: { Size: '1.2 GB', Format: 'PDF / Source Code', License: 'Personal & Commercial Use', Updates: 'Lifetime Access' },
    download_url: "/downloads/854187065-1000-Manually-Tested-Web-Applications-With-20-Free-Premium-Bonuses-Ro6wlx.pdf",
    install_guide: "#"
  },
  {
    name: "Ultimate Web Development Bundle",
    description: "The ultimate bundle for web developers, curated by Glexmedia. Includes premium templates, scripts, UI kits.",
    price: 300,
    category: "Bundles",
    image: "/images/products/ultimate-web-dev-bundle.png",
    in_stock: true,
    rating: 4.9,
    features: ['Premium Templates', 'UI Kits', 'Scripts & Plugins', 'Developer Tools', 'Regular Updates'],
    specs: { Format: 'ZIP / PDF', License: 'Royalty Free', Support: 'Priority Email Support', Components: '500+' },
    download_url: "/downloads/863374232-Ultimate-Web-Devlopment-Bundle-by-Glexmedia-in-Vppalw-2.pdf",
    install_guide: "#"
  },
  {
    name: "Ultimate Mega Bundle",
    description: "A massive collection of digital assets. Your one-stop shop for premium creative content.",
    price: 400,
    category: "Bundles",
    image: "/images/products/ultimate-mega-bundle.png",
    in_stock: true,
    rating: 5.0,
    features: ['Huge Asset Library', 'Diverse Categories', 'High-Res Graphics', 'Ready-to-use Code', 'Exclusive Content'],
    specs: { Download: 'Instant', Categories: 'Design, Code', 'File Types': 'PSD, AI, HTML', 'Total Files': '5000+' },
    download_url: "/downloads/Ultimate%20Mega%20Bundle.pdf",
    install_guide: "#"
  },
  {
    name: "Web Applications Collection",
    description: "A curated selection of high-quality functional web apps for your projects.",
    price: 250,
    category: "Web Development",
    image: "/images/products/web-apps-collection.png",
    in_stock: true,
    rating: 4.7,
    features: ['Modern Tech Stack', 'Responsive Designs', 'Well-Documented', 'Easy Customization', 'Performance Optimized'],
    specs: { DB: 'SQL/NoSQL', Backend: 'Node.js', Frameworks: 'React, Vue', 'Apps Included': '50+' },
    download_url: "/downloads/Web-Applications-dxz4w4_260202_014423.pdf",
    install_guide: "#"
  },
  {
    name: "AI Legal Agent Team (Autonomous Contract Review)",
    description: "A multi-agent legal department that handles contract review, legal research, risk assessment, and compliance checks via specialized researcher and strategist agents.",
    price: 2499,
    category: "AI Agents",
    image: "/images/products/ai-legal-agent.png",
    in_stock: true,
    rating: 5.0,
    features: ["Contract Review Engine", "Legal Research Synthesis", "Risk Assessment Agent", "Specialize Legal Strategists", "Streamlit Command Center"],
    specs: { API: 'OpenAI / Anthropic', Framework: 'Phidata / Agno', Format: 'Python / Streamlit', License: 'Resell Rights', Support: 'Documentation Provided' },
    download_url: "/downloads/ai-legal-agent.zip",
    install_guide: "#"
  },
  {
    name: "TripCraft AI - Autonomous Travel Planner",
    description: "An autonomous travel planning system that creates personalized itineraries by researching destinations, flights, and hotels across the web using specialized agents.",
    price: 1499,
    category: "AI Agents",
    image: "/images/products/tripcraft-ai.png",
    in_stock: true,
    rating: 4.9,
    features: ["Autonomous Itinerary Generation", "Web-scale Destination Research", "Flight/Hotel Sourcing Intelligence", "Phidata Framework Powered", "Customizable Planner UI"],
    specs: { API: 'OpenAI, DuckDuckGo', Framework: 'Phidata', Format: 'Python / Streamlit', Support: 'Priority Email Support', Components: '3+ Agents' },
    download_url: "/downloads/tripcraft-ai.zip",
    install_guide: "#"
  },
  {
    name: "AI Audio Tour Agent (Voice-Enabled)",
    description: "A voice-enabled AI agent that generates automated, narrated audio tours for any location using GPT-4 scriptwriting and TTS for delivery.",
    price: 1999,
    category: "Voice AI",
    image: "/images/products/audio-tour-agent.png",
    in_stock: true,
    rating: 4.8,
    features: ["Location-aware Script Writing", "OpenAI TTS Voice Synthesis", "Interactive Map Markers Ready", "Bespoke Narrative Engine", "Ready for Mobile Deployment"],
    specs: { API: 'OpenAI GPT-4 & TTS', UI: 'Streamlit', Format: 'Python', Requirements: 'Python 3.10+', Logic: 'Narrative Synthesis' },
    download_url: "/downloads/audio-tour-agent.zip",
    install_guide: "#"
  },
  {
    name: "AI Services Agency (Swarm-in-a-Box)",
    description: "A fully automated 'agency-in-a-box' using CrewAI to simulate roles like Sales Manager and Solution Architect to handle professional service inquiries.",
    price: 2999,
    category: "Business Transformation",
    image: "/images/products/ai-services-agency.png",
    in_stock: true,
    rating: 4.9,
    features: ["CrewAI Multi-agent Swarm", "Automated Solution Architecture", "Intelligent Sales Workflow", "Client Requirement Synthesis", "Enterprise Ready Framework"],
    specs: { API: 'OpenAI / Claude', Framework: 'CrewAI', Format: 'Python', Logic: 'Multi-Agent Coordination', Dashboard: 'Included' },
    download_url: "/downloads/ai-services-agency.zip",
    install_guide: "#"
  },
  {
    name: "AI Recruitment Agent Team (HR Automation)",
    description: "An HR automation system that uses a Job Spec Agent to define roles and a Resume Screener Agent to score and filter candidates automatically.",
    price: 1799,
    category: "AI Agents",
    image: "/images/products/recruitment-agent-team.png",
    in_stock: true,
    rating: 4.7,
    features: ["Job Spec Automation Agent", "Candidate Screening Scorecard", "Automated Interview Scheduling", "Resume Selection Intelligence", "Team Orchestration Ready"],
    specs: { API: 'OpenAI, Phidata', Framework: 'Agno', Target: 'HR / Recruiters', Format: 'Python', Support: 'Lifetime Updates' },
    download_url: "/downloads/recruitment-agent-team.zip",
    install_guide: "#"
  },
  {
    name: "AI Finance Agent Team (Market Intelligence)",
    description: "A sophisticated technical market oracle that synthesizes real-time stock, crypto, and market metrics into actionable intelligence reports using multi-agent coordination.",
    price: 2499,
    category: "AI Agents",
    image: "/images/products/ai-finance-agent.png",
    in_stock: true,
    rating: 5.0,
    features: ["Real-time Market Telemetry", "Technical Analysis Engine", "Automated Report Synthesis", "Multi-Agent Risk Assessment", "Streamlit Financial Dashboard"],
    specs: { API: 'xAI / OpenAI / YFinance', Framework: 'Agno', Format: 'Python', Support: 'Priority Support', Components: '3 Agents' },
    download_url: "/downloads/ai-finance-agent.zip",
    install_guide: "#"
  },
  {
    name: "AI Real Estate Agent (Property Analyst)",
    description: "An autonomous property market analyzer that researches real estate listings, trends, and neighborhood metrics to provide comprehensive investment advice.",
    price: 1999,
    category: "AI Agents",
    image: "/images/products/real-estate-agent.png",
    in_stock: true,
    rating: 4.9,
    features: ["Neighborhood Data Scraping", "Investment ROI Calculator", "Property Value Predictor", "Market Trend Analysis", "Automated Listing Research"],
    specs: { API: 'OpenAI, Zillow API Ready', Framework: 'Phidata', Format: 'Python / Streamlit', Support: 'Lifetime Access', Components: 'Real Estate Oracle' },
    download_url: "/downloads/real-estate-agent.zip",
    install_guide: "#"
  },
  {
    name: "AI Competitor Intelligence Agent",
    description: "A deep-web intelligence agent that monitors competitor activities, product launches, and pricing changes to give you a strategic edge in your niche.",
    price: 2799,
    category: "AI Agents",
    image: "/images/products/competitor-intel-agent.png",
    in_stock: true,
    rating: 5.0,
    features: ["Autonomous Competitor Monitoring", "Pricing Strategy Analysis", "Brand Perception Tracking", "Market Gap Identification", "Strategic SWOT Generation"],
    specs: { API: 'Perplexity / Firecrawl', Framework: 'Agno', Format: 'Python', Context: 'Business Intelligence', Support: 'Priority Email' },
    download_url: "/downloads/competitor-intel-agent.zip",
    install_guide: "#"
  },
  {
    name: "AI VC Due Diligence Agent",
    description: "The ultimate tool for investors and VCs. Automatically researches startups, analyzes pitch decks, and provides objective due diligence reports on any company.",
    price: 3499,
    category: "Finance & Investment",
    image: "/images/products/vc-due-diligence-agent.png",
    in_stock: true,
    rating: 5.0,
    features: ["Pitch Deck Vision Analysis", "Company Valuation Modeling", "Founder Background Check", "Competitive Landscape Scan", "Automated Due Diligence Docs"],
    specs: { API: 'Gemini Vision / OpenAI', Framework: 'Agno', Format: 'Python / Streamlit', License: 'Agency Whitelabel', Support: '1-on-1 Setup' },
    download_url: "/downloads/vc-due-diligence-agent.zip",
    install_guide: "#"
  },
  {
    name: "AI SEO Audit Team (Growth Engine)",
    description: "A multi-agent SEO agency that performs deep technical audits, keyword research, and content optimization recommendations to scale your organic traffic.",
    price: 1599,
    category: "Marketing",
    image: "/images/products/seo-audit-team.png",
    in_stock: true,
    rating: 4.8,
    features: ["Technical Crawler Agent", "Keyword Research strategist", "Content Optimization engine", "Backlink Analysis tools", "Growth Roadmap generation"],
    specs: { API: 'Anthropic / OpenAI / SerpApi', Framework: 'CrewAI / Phidata', Format: 'Python', Target: 'Digital Marketers', Support: 'Community Discord' },
    download_url: "/downloads/seo-audit-team.zip",
    install_guide: "#"
  },
  {
    name: "AI Game Design Agent Team",
    description: "A creative power-house for game developers. Coordinates between Narrative Architects and Mechanics Engineers to build complex game worlds and rulebooks.",
    price: 1299,
    category: "Game Dev",
    image: "/images/products/game-design-agent.png",
    in_stock: true,
    rating: 4.9,
    features: ["Narrative World Building", "Game Mechanics balancing", "Character Archetype design", "Rulebook Synthesis agent", "Unity/Unreal prompt generation"],
    specs: { API: 'OpenAI GPT-4', Framework: 'Agno', Target: 'Indie Game Devs', Format: 'Python', Support: 'Project Templates' },
    download_url: "/downloads/game-design-agent.zip",
    install_guide: "#"
  }
];

async function execute() {
  console.log('1. Clearing current product list in Supabase...');
  
  const { error: delErr } = await supabase.from('products').delete().neq('name', 'impossible_name_that_should_never_exist_!@#');
  
  if (delErr) {
    console.error('Failed to clear old products:', delErr);
    return;
  }
  
  console.log('2. Syncing updated product list with new minimalist thumbnails...');
  
  for (const p of products) {
    const { error } = await supabase.from('products').upsert(p, { onConflict: 'name' });
    if (error) {
      console.error(`❌ Failed to insert: ${p.name}`, error);
    } else {
      console.log(`✅ Synced: ${p.name}`);
    }
  }
  
  console.log('Done! Database reflects new product thumbnails.');
}

execute();
