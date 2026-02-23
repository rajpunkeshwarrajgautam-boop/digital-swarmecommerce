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
    features: ['Autonomous Deep Web Scrape', 'Dual-Agent Synthesis Architecture', 'Cyberpunk Streamlit UI', 'OpenAI Agents SDK Powered', 'Full Source Code Included'],
    specs: { API: 'OpenAI, Firecrawl', Format: 'Python / Source', License: 'Resell Rights (MRR)', Support: 'Documentation Provided', Components: '2 Agents + UI' }
  },
  {
    id: "swarm-sales",
    name: "Swarm Corporate Growth Team (Multi-Agent)",
    description: "An elite multi-agent team designed for enterprise-level sales intelligence. Coordinates between Lead Infiltrators, Outreach Strategists, and Closing Architects.\n\n🚀 DEPLOYMENT GUIDE:\n1. System Requirements: Python 3.10+, CrewAI / LangChain environment.\n2. Install the Swarm toolkit: 'pip install -r requirements.txt'.\n3. Link your 'GEMINI_API_KEY' in the '.env' file.\n4. Launch the Sales Command Center: 'python agent.py'.",
    price: 1999,
    category: "AI Agents",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60",
    inStock: true,
    rating: 5.0,
    features: ['Lead Scoring Engine', 'Multi-Agent Coordination Logic', 'CRM Integration Ready', 'Automated Outreach Workflows', 'Dashboard Analytics'],
    specs: { API: 'OpenAI / Claude', Format: 'Python / CrewAI', License: 'Master Resell Rights', Support: 'Priority Support', Components: '3+ Agents' }
  },
  {
    id: "swarm-finance",
    name: "Swarm Finance Infiltrator (xAI Oracle)",
    description: "A high-speed technical market oracle powered by xAI Grok. Synthesizes real-time stock, crypto, and market metrics into actionable intelligence.\n\n🚀 DEPLOYMENT GUIDE:\n1. Deployment Stack: Python 3.11, Agno Framework.\n2. Install market telemetry tools: 'pip install -r requirements.txt'.\n3. Inject your 'XAI_API_KEY' (Grok) into the '.env' configuration.\n4. Activate the Oracle: 'python src/agents/finance_agent.py'.",
    price: 2499,
    category: "AI Agents",
    image: "https://images.unsplash.com/photo-1611974717482-58a25a3d5be0?w=800&auto=format&fit=crop&q=60",
    inStock: true,
    rating: 5.0,
    features: ['xAI Grok Intelligence', 'Real-time Stock/Crypto Uplink', 'Technical Analysis Engine', 'Market Sentiment Scrape', 'Full Source Code Included'],
    specs: { API: 'xAI, YFinance', Format: 'Python / Agno', License: 'Master Resell Rights', Support: 'Priority Support', Components: 'Finance Oracle' }
  },
  {
    id: "swarm-cinema",
    name: "Swarm Cinema Infiltrator (AI Movie Producer)",
    description: "A God Tier multi-agent production engine. Coordinates Script Architects and Talent Oracles to materialize movie blueprints and casting strategies using live search telemetry.\n\n🚀 DEPLOYMENT GUIDE:\n1. Production Stack: Python 3.10, Streamlit, Agno.\n2. Install the Cinema Unit dependencies: 'pip install -r requirements.txt'.\n3. Configure 'GOOGLE_API_KEY' and 'SERP_API_KEY' for live talent scouting.\n4. Start the Production Hive: 'streamlit run agent.py'.",
    price: 2999,
    category: "AI Agents",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=60",
    inStock: true,
    rating: 5.0,
    features: ['Multi-Agent Film Orchestration', 'Live Talent Scouting (SerpApi)', 'Cyberpunk Narrative Engine', '3-Act Structure Synthesis', 'Full Source Code Included'],
    specs: { API: 'Gemini, SerpApi', Format: 'Python / Agno', License: 'Master Resell Rights', Support: 'Priority Support', Components: 'Script + Casting + Producer' }
  },
  {
    id: "web-apps-1000",
    name: "1000 Manually Tested Web Applications",
    description: "A comprehensive collection of 1000 manually tested web applications, including 20 free premium bonuses.",
    price: 200,
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1200&auto=format&fit=crop&q=80",
    inStock: true,
    rating: 4.8,
    features: ['1000+ Tested Applications', '20 Premium Bonuses', 'Diverse Use Cases', 'Clean Codebase', 'Instant Download'],
    specs: { Size: '1.2 GB', Format: 'PDF / Source Code', License: 'Personal & Commercial Use', Updates: 'Lifetime Access' }
  },
  {
    id: "web-bundle-ultimate",
    name: "Ultimate Web Development Bundle",
    description: "The ultimate bundle for web developers, curated by Glexmedia. Includes templates, scripts, UI kits.",
    price: 200,
    category: "Bundles",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80",
    inStock: true,
    rating: 4.9,
    features: ['Premium Templates', 'UI Kits', 'Scripts & Plugins', 'Developer Tools', 'Regular Updates'],
    specs: { Format: 'ZIP / PDF', License: 'Royalty Free', Support: 'Priority Email Support', Components: '500+' }
  },
  {
    id: "mega-bundle-ultimate",
    name: "Ultimate Mega Bundle",
    description: "A massive collection of digital assets. Your one-stop shop for premium creative content.",
    price: 200,
    category: "Bundles",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&auto=format&fit=crop&q=80",
    inStock: true,
    rating: 5.0,
    features: ['Huge Asset Library', 'Diverse Categories', 'High-Res Graphics', 'Ready-to-use Code', 'Exclusive Content'],
    specs: { Download: 'Instant', Categories: 'Design, Code', File Types: 'PSD, AI, HTML', 'Total Files': '5000+' }
  },
  {
    id: "web-apps-collection",
    name: "Web Applications Collection",
    description: "A curated selection of high-quality functional web apps for your projects.",
    price: 200,
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80",
    inStock: true,
    rating: 4.7,
    features: ['Modern Tech Stack', 'Responsive Designs', 'Well-Documented', 'Easy Customization', 'Performance Optimized'],
    specs: { DB: 'SQL/NoSQL', Backend: 'Node.js', Frameworks: 'React, Vue', 'Apps Included': '50+' }
  }
];
