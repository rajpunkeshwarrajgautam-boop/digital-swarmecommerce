import { Product } from "./types";

export const products: Product[] = [
  {
    id: "sentinel-research",
    name: "Sentinel Research Infiltrator (AI Agent)",
    description: "An autonomous deep-research intelligence agent. Infiltrates surface and deep web layers to synthesize professional intelligence reports on any target.\n\n🚀 DEPLOYMENT GUIDE:\n1. Ensure Python 3.10+ is installed.\n2. Install dependencies: 'pip install -r requirements.txt'.\n3. Populate '.env' with 'OPENAI_API_KEY' and 'FIRECRAWL_API_KEY'.\n4. Execute: 'python sentinel_researcher.py'.",
    price: 1000,
    category: "AI Agents",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60",
    inStock: true,
    rating: 5.0,
    features: ['Autonomous Deep Web Scrape', 'Dual-Agent Synthesis', 'Cyberpunk Streamlit UI', 'OpenAI Agents SDK Powered', 'Full Source Code'],
    specs: { Format: 'Python / Source', Components: '2 Agents + UI', API: 'OpenAI, Firecrawl', License: 'Resell Rights (MRR)', Support: 'Documentation' }
  },
  {
    id: "swarm-sales",
    name: "Swarm Corporate Growth Team (Multi-Agent)",
    description: "An elite multi-agent team designed for enterprise-level sales intelligence. Coordinates between Lead Infiltrators, Outreach Strategists, and Closing Architects.\n\n🚀 DEPLOYMENT GUIDE:\n1. Python 3.10+ and CrewAI environment.\n2. Install: 'pip install -r requirements.txt'.\n3. Link 'GEMINI_API_KEY' in .env.\n4. Launch: 'python agent.py'.",
    price: 1999,
    category: "AI Agents",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60",
    inStock: true,
    rating: 5.0,
    features: ['Lead Scoring Engine', 'Multi-Agent Coordination', 'CRM Integration Ready', 'Automated Outreach', 'Dashboard Analytics'],
    specs: { Format: 'Python / CrewAI', Components: '3+ Agents', API: 'OpenAI / Claude', License: 'Master Resell Rights', Support: 'Priority Support' }
  },
  {
    id: "swarm-finance",
    name: "Swarm Finance Infiltrator (xAI Oracle)",
    description: "A high-speed technical market oracle powered by xAI Grok. Synthesizes real-time stock, crypto, and market metrics into actionable intelligence.\n\n🚀 DEPLOYMENT GUIDE:\n1. Python 3.11, Agno Framework.\n2. Install: 'pip install -r requirements.txt'.\n3. Inject 'XAI_API_KEY' into .env.\n4. Activate: 'python src/agents/finance_agent.py'.",
    price: 2499,
    category: "AI Agents",
    image: "https://images.unsplash.com/photo-1611974717482-58a25a3d5be0?w=800&auto=format&fit=crop&q=60",
    inStock: true,
    rating: 5.0,
    features: ['xAI Grok Intelligence', 'Real-time Stock/Crypto Uplink', 'Technical Analysis Engine', 'Market Sentiment Scrape', 'Full Source Code'],
    specs: { Format: 'Python / Agno', Components: 'Finance Oracle', API: 'xAI, YFinance', License: 'Master Resell Rights', Support: 'Priority Support' }
  },
  {
    id: "swarm-cinema",
    name: "Swarm Cinema Infiltrator (AI Movie Producer)",
    description: "A God Tier multi-agent production engine. Coordinates Script Architects and Talent Oracles to materialize movie blueprints using live search telemetry.\n\n🚀 DEPLOYMENT GUIDE:\n1. Python 3.10, Streamlit, Agno.\n2. Install: 'pip install -r requirements.txt'.\n3. Configure 'GOOGLE_API_KEY' and 'SERP_API_KEY'.\n4. Start: 'streamlit run agent.py'.",
    price: 2999,
    category: "AI Agents",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=60",
    inStock: true,
    rating: 5.0,
    features: ['Multi-Agent Film Orchestration', 'Live Talent Scouting', 'Cyberpunk Narrative Engine', '3-Act Structure Synthesis', 'Full Source Code'],
    specs: { Format: 'Python / Agno', Components: 'Script + Casting + Producer', API: 'Gemini, SerpApi', License: 'Master Resell Rights', Support: 'Priority Support' }
  },
  {
    id: "mega-bundle",
    name: "Digital Swarm: Ultimate Mega Bundle",
    description: "Our complete repository of 1000+ manually tested web applications, UI kits, and premium scripts. The ultimate starter pack for any agency.\n\n🚀 DEPLOYMENT GUIDE:\n1. Download the master ZIP pack.\n2. Extract to your workspace.\n3. Explore categorized modules.",
    price: 200,
    category: "Bundles",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
    inStock: true,
    rating: 5.0,
    features: ['1000+ Tested Apps', 'Premium UI Kits', 'Exclusive Scripts', 'Instant Access', 'Resell Rights'],
    specs: { Format: 'ZIP / PDF', Size: '5.4 GB', Components: '1000+', License: 'Royalty Free', Support: '24/7' }
  }
];
