import { Product } from "./types";

export const products: Product[] = [
  {
    id: "agent-1",
    name: "AI Deep Research Agent",
    description: "A powerful research assistant that leverages OpenAI's Agents SDK and Firecrawl to perform comprehensive web research and synthesize deep insights.",
    price: 1499,
    category: "Advanced Agents",
    image: "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=800&auto=format&fit=crop&q=60",
    inStock: true,
    rating: 4.9,
    features: [
      'Deep Web Research',
      'OpenAI Agents SDK',
      'Firecrawl Integration',
      'Downloadable Markdown Reports',
      'Interactive UI'
    ],
    specs: {
      "Kernel": "Agents SDK",
      "Network": "Firecrawl",
      "Model": "GPT-4o",
      "License": "Commercial",
      "Updates": "Quarterly"
    },
    downloadUrl: "https://github.com/Shubhamsaboo/awesome-llm-apps/archive/refs/heads/main.zip",
    installGuide: "https://github.com/Shubhamsaboo/awesome-llm-apps/blob/main/advanced_ai_agents/single_agent_apps/ai_deep_research_agent/README.md"
  },
  {
    id: "agent-2",
    name: "AI System Architect (R1)",
    description: "An advanced system design agent powered by DeepSeek R1. Capable of generating complex architecture diagrams and technical specifications autonomously.",
    price: 1999,
    category: "Advanced Agents",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60",
    inStock: true,
    rating: 5.0,
    features: [
      'DeepSeek R1 Core',
      'Autonomous Design',
      'Diagram Generation',
      'Tech Spec Authoring',
      'Self-Correction'
    ],
    specs: {
      "Model": "DeepSeek R1",
      "Context": "128k Tokens",
      "Output": "Mermaid / Markdown",
      "License": "Enterprise",
      "Support": "Priority"
    },
    downloadUrl: "https://github.com/Shubhamsaboo/awesome-llm-apps/archive/refs/heads/main.zip",
    installGuide: "https://github.com/Shubhamsaboo/awesome-llm-apps/blob/main/advanced_ai_agents/single_agent_apps/ai_system_architect_r1/README.md"
  },
  {
    id: "agent-3",
    name: "AI VC Due Diligence Team",
    description: "A multi-agent team designed for venture capital analysis. Coordinates multiple specialized agents to evaluate startups, market trends, and financial health.",
    price: 2499,
    category: "Agent Teams",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
    inStock: true,
    rating: 4.8,
    features: [
      'Multi-Agent Coordination',
      'Startup Scoring',
      'Market Sentiment Analysis',
      'Risk Assessment',
      'Team Debrief Reports'
    ],
    specs: {
      "Team Size": "5 Agents",
      "Protocol": "Swarm Logic",
      "Data": "Live APIs",
      "Duration": "Indefinite",
      "Security": "Encrypted"
    },
    downloadUrl: "https://github.com/Shubhamsaboo/awesome-llm-apps/archive/refs/heads/main.zip",
    installGuide: "https://github.com/Shubhamsaboo/awesome-llm-apps/blob/main/advanced_ai_agents/multi_agent_apps/agent_teams/ai_vc_due_diligence_agent_team/README.md"
  },
  {
    id: "agent-4",
    name: "AI Self-Evolving Agent",
    description: "A revolutionary autonomous agent that learns from its own execution history and feedback loops to optimize its performance over time.",
    price: 2999,
    category: "Research Agents",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60",
    inStock: true,
    rating: 5.0,
    features: [
      'Recursive Training',
      'Feedback Integration',
      'Performance Metrics',
      'Dynamic Optimization',
      'Long-term Memory'
    ],
    specs: {
      "State": "Persistent",
      "Learning": "Neural-Adaptive",
      "Core": "Gemini 1.5 Pro",
      "Uptime": "99.9%",
      "Type": "Experimental"
    },
    downloadUrl: "https://github.com/Shubhamsaboo/awesome-llm-apps/archive/refs/heads/main.zip",
    installGuide: "https://github.com/Shubhamsaboo/awesome-llm-apps/blob/main/advanced_ai_agents/multi_agent_apps/ai_Self-Evolving_agent/README.md"
  },
  {
    id: "agent-5",
    name: "AI Blog to Podcast Agent",
    description: "Instantly transform written content into high-quality audio podcasts with natural voice synthesis and conversational structuring.",
    price: 799,
    category: "Media Agents",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=60",
    inStock: true,
    rating: 4.7,
    features: [
      'Natural TTS Synthesis',
      'Multi-voice Support',
      'Script Generation',
      'Background Scoring',
      'Social Media Snippets'
    ],
    specs: {
      "Voice": "Neural HDR",
      "Output": "MP3 / FLAC",
      "Speed": "5x Realtime",
      "Integration": "RSS / Spotify",
      "Storage": "Clour Sync"
    },
    downloadUrl: "https://github.com/Shubhamsaboo/awesome-llm-apps/archive/refs/heads/main.zip",
    installGuide: "https://github.com/Shubhamsaboo/awesome-llm-apps/blob/main/starter_ai_agents/ai_blog_to_podcast_agent/README.md"
  },
  {
    id: "agent-6",
    name: "AI Medical Imaging Agent",
    description: "Sophisticated computer vision agent trained to analyze medical scans and provide preliminary diagnostic suggestions with high accuracy.",
    price: 1899,
    category: "Specialized Agents",
    image: "https://images.unsplash.com/photo-1576091160550-21735999ef04?w=800&auto=format&fit=crop&q=60",
    inStock: true,
    rating: 4.6,
    features: [
      'X-Ray Analysis',
      'MRI Interpretation',
      'Privacy First (HIPAA Ready)',
      'Doctor-in-the-loop Support',
      'Secure Data Handling'
    ],
    specs: {
      "Precision": "99.2%",
      "Type": "Computer Vision",
      "Framework": "PyTorch",
      "Data": "Anonymized",
      "Audit": "Third-party Verified"
    },
    downloadUrl: "https://github.com/Shubhamsaboo/awesome-llm-apps/archive/refs/heads/main.zip",
    installGuide: "https://github.com/Shubhamsaboo/awesome-llm-apps/blob/main/starter_ai_agents/ai_medical_imaging_agent/README.md"
  },
  {
    id: "agent-7",
    name: "AI Sales Intelligence Team",
    description: "An elite squad of agents for B2B sales. Automates prospecting, outreach personalization, and meeting scheduling autonomously.",
    price: 1599,
    category: "Agent Teams",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=60",
    inStock: true,
    rating: 4.9,
    features: [
      'Lead Generation',
      'Hyper-Personalization',
      'Automated Follow-ups',
      'Calendar Sync',
      'CRM Integration'
    ],
    specs: {
      "Leads": "Unlimited",
      "Mail": "Warmer Included",
      "Model": "Claude 3.5 Sonnet",
      "Report": "Weekly PDF",
      "Support": "24/7"
    },
    downloadUrl: "https://github.com/Shubhamsaboo/awesome-llm-apps/archive/refs/heads/main.zip",
    installGuide: "https://github.com/Shubhamsaboo/awesome-llm-apps/blob/main/advanced_ai_agents/multi_agent_apps/agent_teams/ai_sales_intelligence_agent_team/README.md"
  },
  {
    id: "agent-8",
    name: "AI Financial Coach Agent",
    description: "Personalized wealth management and budget planning agent. Analyzes spending patterns and provides data-driven investment advice.",
    price: 999,
    category: "Specialized Agents",
    image: "https://images.unsplash.com/photo-1579621970795-87faff2f9050?w=800&auto=format&fit=crop&q=60",
    inStock: true,
    rating: 4.8,
    features: [
      'Portfolio Tracking',
      'Risk Profiling',
      'Goal-based Planning',
      'Market Alerts',
      'Crypto & Stock Sync'
    ],
    specs: {
      "Markets": "Global",
      "Latency": "Real-time",
      "Security": "Bank-Grade",
      "Platform": "Web / Mobile",
      "Updates": "Daily"
    },
    downloadUrl: "https://github.com/Shubhamsaboo/awesome-llm-apps/archive/refs/heads/main.zip",
    installGuide: "https://github.com/Shubhamsaboo/awesome-llm-apps/blob/main/advanced_ai_agents/multi_agent_apps/ai_financial_coach_agent/README.md"
  }
];
