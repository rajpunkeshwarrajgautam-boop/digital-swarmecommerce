
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const expansionProducts = [
  {
    name: 'Sentinel Research Infiltrator (AI Agent)',
    description: 'An autonomous deep-research intelligence agent. Infiltrates surface and deep web layers to synthesize professional intelligence reports on any target.',
    price: 200.00,
    category: 'AI Agents',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60',
    in_stock: true,
    rating: 5.0,
    features: ['Autonomous Deep Web Scrape', 'Dual-Agent Synthesis Architecture', 'Cyberpunk Streamlit UI', 'OpenAI Agents SDK Powered', 'Full Source Code Included'],
    specs: { Format: 'Python / Source', Components: '2 Agents + UI', API: 'OpenAI, Firecrawl', License: 'Resell Rights (MRR)', Support: 'Documentation Provided' }
  }
];

async function expand() {
  console.log("Infiltrating Supabase to expand catalog...");
  
  const { data, error } = await supabase
    .from('products')
    .insert(expansionProducts)
    .select();

  if (error) {
    console.error("Expansion failed:", error.message);
    return;
  }

  console.log("SUCCESS: Sentinel Research Infiltrator is now LIVE on Digital Swarm.");
  console.log("New Assets Added:", data.length);
}

expand();
