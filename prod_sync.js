
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// This script mirrors the behavior of /api/products/sync but runs locally 
// to ensure the production database is 100% up-to-date.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Simplified product list with premium branding for DB sync
const catalog = [
  {
    name: "Sentinel Research Infiltrator (Deep Intelligence)",
    description: "An autonomous deep-research AI agent. Give it a topic and it infiltrates the surface and deep web to synthesize a professional intelligence report — automatically. Powered by Perplexity and Firecrawl for unparallelled market visibility.",
    price: 2799,
    category: "AI Agents",
    image: "/images/products/sentinel-research.png",
    in_stock: true,
    rating: 5.0,
    features: ['Autonomous Deep Web Scrape', 'Dual-Agent Synthesis Architecture', 'Cyberpunk Streamlit UI', 'Perplexity Research Uplink', 'Full Source Code Included'],
    specs: { API: 'OpenAI, Firecrawl, Perplexity', Format: 'Python / Streamlit', License: 'Master Resell Rights (MRR)', Support: 'Priority Support', Components: '2 Agents + UI' },
    download_url: "/downloads/competitor-intel-agent.zip",
    install_guide: "### Strategic Deployment\n1. **Environment**: Python 3.10+ required.\n2. **Setup**: \n   ```bash\n   pip install -r requirements.txt\n   cp .env.example .env\n   ```\n3. **Uplink**: Add `PERPLEXITY_API_KEY` and `FIRECRAWL_API_KEY` to `.env`.\n4. **Launch**: `python intel.py` or `streamlit run app.py`.\n\n### Usage Manual\nProvide 3 competitor targets. The agent crawls their changelogs, brand mentions, and technical stack updates. Output is a 10-page market intelligence PDF."
  },
  {
    name: "Swarm Corporate Growth Team (Autonomous Sales)",
    description: "An elite multi-agent sales intelligence team. Coordinates Lead Infiltrators, Outreach Strategists, and Closing Architects to handle enterprise-grade sales pipelines autonomously via CrewAI.",
    price: 2999,
    category: "AI Agents",
    image: "/images/products/swarm-sales.png",
    in_stock: true,
    rating: 5.0,
    features: ['Lead Scoring Engine', 'Multi-Agent Coordination', 'CRM Integration Ready', 'Automated Outreach Workflows', 'Full Source Code Included'],
    specs: { API: 'OpenAI / Claude', Framework: 'CrewAI', Format: 'Python', License: 'Master Resell Rights', Support: 'Priority Support', Components: '3+ Agents' },
    download_url: "/downloads/ai-services-agency.zip",
    install_guide: "### Growth Protocol\n1. **Environment**: `python -m venv venv` and activate.\n2. **Install**: `pip install 'crewai[tools]'`.\n3. **Auth**: Add `ANTHROPIC_API_KEY` to `.env`.\n4. **Run**: `python main.py`.\n\n### Workflow\nFeed client pain points into the hive-mind. The 'Sales Manager' scout identifies leads, the 'Architect' designs the pitch, and the 'Writer' generates a professional PDF proposal."
  },
  {
    name: "Swarm Finance Infiltrator (xAI Oracle)",
    description: "A high-speed financial market oracle powered by xAI Grok and Agno. Synthesizes real-time stock, crypto, and market telemetry data into actionable trading intelligence reports.",
    price: 2499,
    category: "AI Agents",
    image: "/images/products/swarm-finance.png",
    in_stock: true,
    rating: 5.0,
    features: ["xAI Grok Intelligence", "Real-time Market Telemetry", "Technical Analysis Engine", "Market Sentiment Scraping", "Streamlit Financial Dashboard"],
    specs: { API: 'xAI / OpenAI / YFinance', Framework: 'Agno', Format: 'Python / Streamlit', Support: 'Priority Support', License: 'Resell Rights' },
    download_url: "/downloads/ai-finance-agent.zip",
    install_guide: "### Technical Oracle Setup\n1. **Install**: `pip install yfinance agno streamlit pandas`.\n2. **Uplink**: Add `XAI_API_KEY` to your secrets.\n3. **Launch**: `streamlit run finance_oracle.py`.\n\n### Data Flow\nEnter a ticker (AAPL, BTC). The 'Oracle Agent' pulls technical indicators (RSI, MACD), sentiment-scans social feeds, and returns a high-confidence Buy/Sell report."
  },
  {
    name: "Swarm Cinema Infiltrator (AI Producer)",
    description: "A creative power-house for content creators and filmmakers. Coordinates between Narrative Architects and Mechanics Engineers to build complex worlds, scripts, and balanced production rulebooks autonomously.",
    price: 1299,
    category: "Entertainment AI",
    image: "/images/products/swarm-cinema.png",
    in_stock: true,
    rating: 4.9,
    features: ["Narrative World Building", "Game Mechanics balancing", "Character Archetype design", "Rulebook Synthesis agent", "Unity/Unreal prompt generation"],
    specs: { API: 'OpenAI GPT-4', Framework: 'Agno', Target: 'Film & Game Devs', Format: 'Python', Support: 'Project Templates' },
    download_url: "/downloads/game-design-agent.zip",
    install_guide: "### Production Setup\n1. **Install**: `pip install agno openai pydantic`.\n2. **Launch**: `python creative_engine.py`.\n\n### Creative Workflow\nInput a concept (e.g. 'Neon Tokyo Noir'). The Narrative agent builds the lore, character arcs, and script beats. Mechanics agent generates balancing formulas for technical execution."
  },
  {
    name: "Swarm Legal Infiltrator (Contract Oracle)",
    description: "A multi-agent legal department that handles contract review, legal research, risk assessment, and compliance checks. It uses autonomous researcher and strategist agents to synthesize complex legal documents.",
    price: 2499,
    category: "AI Agents",
    image: "/images/products/swarm-legal.png",
    in_stock: true,
    rating: 5.0,
    features: ["Contract Review Engine", "Legal Research Synthesis", "Risk Assessment Agent", "Specialize Legal Strategists", "Streamlit Command Center"],
    specs: { API: 'OpenAI / Anthropic', Framework: 'Phidata / Agno', Format: 'Python / Streamlit', License: 'Resell Rights', Support: 'Documentation Provided' },
    download_url: "/downloads/ai-legal-agent.zip",
    install_guide: "### Deployment Guide\n1. **Install**: Python 3.10+.\n2. **Setup**: `pip install -r requirements.txt`.\n3. **Configure**: Add OpenAI API key to `.env`.\n4. **Launch**: `streamlit run app.py`.\n\n### Usage\nUpload any PDF contract. The 'Review Agent' scans for liabilities, and 'Risk Agent' generates a compliance scorecard with suggested clause changes."
  },
  {
    name: "Sentinel Global Voyager (Travel Planner)",
    description: "An autonomous travel planning system that creates personalized itineraries by researching destinations, flights, and hotels across the live web in real-time.",
    price: 1499,
    category: "AI Agents",
    image: "/images/products/sentinel-voyager.png",
    in_stock: true,
    rating: 4.9,
    features: ["Autonomous Itinerary Generation", "Web-scale Destination Research", "Flight/Hotel Sourcing Intelligence", "Phidata Framework Powered", "Customizable Planner UI"],
    specs: { API: 'OpenAI, DuckDuckGo', Framework: 'Phidata', Format: 'Python / Streamlit', Support: 'Priority Email Support', Components: '3+ Agents' },
    download_url: "/downloads/tripcraft-ai.zip",
    install_guide: "### Deployment\n1. **Prerequisites**: OpenAI API Key.\n2. **Setup**: `pip install -r requirements.txt`.\n3. **Run**: `python app.py`.\n\n### Workflow\nEnter location and budget. Voyager browses the live web for the best flight/hotel deals and compiles a full PDF itinerary."
  },
  {
    name: "Swarm Voice Orator (Narrative Synth)",
    description: "A voice-enabled AI agent that generates automated, narrated audio experiences for any text. Uses high-fidelity TTS and scriptwriting to deliver premium audio tours or narratives.",
    price: 1999,
    category: "Voice AI",
    image: "/images/products/swarm-voice.png",
    in_stock: true,
    rating: 4.8,
    features: ["Location-aware Script Writing", "OpenAI TTS Voice Synthesis", "Interactive Map Markers Ready", "Bespoke Narrative Engine", "Ready for Mobile Deployment"],
    specs: { API: 'OpenAI GPT-4 & TTS', UI: 'Streamlit', Format: 'Python', Requirements: 'Python 3.10+', Logic: 'Narrative Synthesis' },
    download_url: "/downloads/audio-tour-agent.zip",
    install_guide: "### Audio Protocol\n1. **Setup**: `pip install openai streamlit pydantic`.\n2. **Uplink**: Add `OPENAI_API_KEY` to secrets.\n3. **Launch**: `streamlit run oratory.py`.\n\n### Usage\nInput a subject. The AI drafts a script, synthesizes high-fidelity audio, and provides downloadable MP3 segments."
  },
  {
    name: "Swarm Talent Infiltrator (HR Oracle)",
    description: "An HR automation system that uses specialized agents to handle the hiring pipeline. Includes Job Spec automation and Resume screening intelligence.",
    price: 1799,
    category: "AI Agents",
    image: "/images/products/swarm-talent.png",
    in_stock: true,
    rating: 4.7,
    features: ["Job Spec Automation Agent", "Candidate Screening Scorecard", "Automated Interview Scheduling", "Resume Selection Intelligence", "Team Orchestration Ready"],
    specs: { API: 'OpenAI, Phidata', Framework: 'Agno', Target: 'HR / Recruiters', Format: 'Python', Support: 'Lifetime Updates' },
    download_url: "/downloads/recruitment-agent-team.zip",
    install_guide: "### HR Deployment\n1. **Setup**: `pip install agno phi pypdf2`.\n2. **Uplink**: Add API keys to dashboard.\n3. **Run**: `python recruiter.py`.\n\n### Usage\nDrop resumes into the `/input` folder. Swarm ranks them by technical suitability and provides interview scripts for the top 5%."
  },
  {
    name: "Swarm Property Infiltrator (Market Oracle)",
    description: "An autonomous property market analyzer that researches real estate listings and neighborhood metrics. Provides comprehensive investment advice by comparing live data against historical trends.",
    price: 1999,
    category: "AI Agents",
    image: "/images/products/swarm-property.png",
    in_stock: true,
    rating: 4.9,
    features: ["Neighborhood Data Scraping", "Investment ROI Calculator", "Property Value Predictor", "Market Trend Analysis", "Automated Listing Research"],
    specs: { API: 'OpenAI, Zillow API Ready', Framework: 'Phidata', Format: 'Python / Streamlit', Support: 'Lifetime Access', Components: 'Real Estate Oracle' },
    download_url: "/downloads/real-estate-agent.zip",
    install_guide: "### Property Protocol\n1. **Setup**: `pip install phidata streamlit googlemaps`.\n2. **Run**: `streamlit run real-estate.py`.\n\n### Usage\nEnter a target area. The Oracle pulls active listings and calculates real ROI based on local tax data and price history."
  },
  {
    name: "Swarm Capital Oracle (VC Due Diligence)",
    description: "The ultimate tool for VCs. Automatically researches startups, analyzes pitch decks using Vision AI, and provides objective due diligence reports in minutes.",
    price: 3499,
    category: "Finance & Investment",
    image: "/images/products/swarm-capital.png",
    in_stock: true,
    rating: 5.0,
    features: ["Pitch Deck Vision Analysis", "Company Valuation Modeling", "Founder Background Check", "Competitive Landscape Scan", "Automated Due Diligence Docs"],
    specs: { API: 'Gemini Vision / OpenAI', Framework: 'Agno', Format: 'Python / Streamlit', License: 'Agency Whitelabel', Support: '1-on-1 Setup' },
    download_url: "/downloads/vc-due-diligence-agent.zip",
    install_guide: "### VC Protocol\n1. **Setup**: `pip install google-generativeai streamlit`.\n2. **Uplink**: Gemini 1.5 Pro API Key required.\n3. **Run**: `streamlit run investor.py`.\n\n### Usage\nUpload a PDF pitch deck. Swarm Vision scans slides, verifies LinkedIn profiles, and outputs a 10-page IC Memo."
  },
  {
    name: "Sentinel SEO Infiltrator (Organic Hive)",
    description: "A multi-agent SEO agency that performs deep technical audits and keyword research. Coordinates between Crawler and Strategist agents to scale organic traffic.",
    price: 1599,
    category: "Marketing AI",
    image: "/images/products/sentinel-seo.png",
    in_stock: true,
    rating: 4.8,
    features: ["Technical Crawler Agent", "Keyword Research strategist", "Content Optimization engine", "Backlink Analysis tools", "Growth Roadmap generation"],
    specs: { API: 'Anthropic / OpenAI / SerpApi', Framework: 'CrewAI / Phidata', Format: 'Python', Target: 'Digital Marketers', Support: 'Community Discord' },
    download_url: "/downloads/seo-audit-team.zip",
    install_guide: "### SEO Protocol\n1. **Setup**: `pip install beautifulsoup4 serpapi crewai`.\n2. **Uplink**: Add SerpApi key to config.\n3. **Run**: `python audit.py`.\n\n### Usage\nInput a URL. Sentinel crawls the architecture, finds H1 gaps, and identifies 'Blue Ocean' keywords for immediate ranking."
  },
  {
    name: "1000 Manually Tested Web Applications",
    description: "A comprehensive collection of 1000 manually tested web applications, including 20 free premium bonuses. Clean code, verified for functionality.",
    price: 200,
    category: "Web Development",
    image: "/images/products/1000-web-apps.png",
    in_stock: true,
    rating: 4.8,
    features: ['1000+ Tested Applications', '20 Premium Bonuses', 'Clean Codebase', 'Instant Download'],
    specs: { Size: '1.2 GB', Format: 'PDF / Source Code', License: 'Personal & Commercial Use' },
    download_url: "/downloads/854187065-1000-Manually-Tested-Web-Applications-With-20-Free-Premium-Bonuses-Ro6wlx.pdf",
    install_guide: "### Installation\n1. Download and extract the archive.\n2. Reference the PDF index to find a project.\n3. Open in VS Code and follow local readme."
  },
  {
    name: "Ultimate Web Development Bundle",
    description: "The ultimate toolkit for modern web developers. Premium templates, high-performance scripts, and essential UI kits curated for speed.",
    price: 300,
    category: "Bundles",
    image: "/images/products/ultimate-web-dev-bundle.png",
    in_stock: true,
    rating: 4.9,
    features: ['Premium Templates', 'UI Kits', 'Scripts & Plugins', 'Developer Tools'],
    specs: { Format: 'ZIP / PDF', License: 'Royalty Free', Support: 'Email' },
    download_url: "/downloads/863374232-Ultimate-Web-Devlopment-Bundle-by-Glexmedia-in-Vppalw-2.pdf",
    install_guide: "### Setup\n1. Extract. 2. Browse components. 3. Copy-paste into your Next.js/React project."
  },
  {
    name: "Ultimate Mega Bundle (Design & Code)",
    description: "A massive all-in-one collection of digital assets, creative content, and high-performance code snippets.",
    price: 400,
    category: "Bundles",
    image: "/images/products/ultimate-mega-bundle.png",
    in_stock: true,
    rating: 5.0,
    features: ['Huge Asset Library', 'High-Res Graphics', 'Ready-to-use Code'],
    specs: { Download: 'Instant', 'File Types': 'PSD, AI, HTML', 'Total Files': '5000+' },
    download_url: "/downloads/Ultimate%20Mega%20Bundle.pdf",
    install_guide: "### Access\n1. Download the PDF. 2. Use the private Mega.nz link inside to access the repository."
  }
];

async function syncProducts() {
  console.log("Starting Production Database Sync...");
  
  // 1. Clear existing products (to ensure clean branding)
  const { error: deleteError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteError) {
    console.error("Error clearing database:", deleteError);
    return;
  }
  console.log("Database cleared.");

  // 2. Insert new elite catalog
  const { data, error } = await supabase.from('products').insert(catalog);
  if (error) {
    console.error("Error inserting catalog:", error);
  } else {
    console.log("Production catalog successfully synchronized with Supabase.");
  }
}

syncProducts();
