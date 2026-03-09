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
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1200&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1478737270239-2fccd2c7fd94?w=1200&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1521791136064-7986c2923216?w=1200&auto=format&fit=crop&q=80",
    in_stock: true,
    rating: 4.7,
    features: ["Job Spec Automation Agent", "Candidate Screening Scorecard", "Automated Interview Scheduling", "Resume Selection Intelligence", "Team Orchestration Ready"],
    specs: { API: 'OpenAI, Phidata', Framework: 'Agno', Target: 'HR / Recruiters', Format: 'Python', Support: 'Lifetime Updates' },
    download_url: "/downloads/recruitment-agent-team.zip",
    install_guide: "#"
  }
];

async function execute() {
  console.log('1. Clearing current product list in Supabase...');
  
  // Safe way to delete all rows - we filter where name is not an impossible string
  const { error: delErr } = await supabase.from('products').delete().neq('name', 'impossible_name_that_should_never_exist_!@#');
  
  if (delErr) {
    console.error('Failed to clear old products:', delErr);
    return;
  }
  
  console.log('2. Syncing updated product list (including new AI agents)...');
  
  for (const p of products) {
    const { error } = await supabase.from('products').upsert(p, { onConflict: 'name' });
    if (error) {
      console.error(`❌ Failed to insert: ${p.name}`, error);
    } else {
      console.log(`✅ Synced: ${p.name}`);
    }
  }
  
  console.log('Done! Database perfectly reflects the updated product catalog.');
}

execute();
