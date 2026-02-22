
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const expansionProducts = [
  {
    name: 'Swarm Cinema Infiltrator (AI Movie Producer)',
    description: 'A God Tier multi-agent production engine. Coordinates Script Architects and Talent Oracles to materialize movie blueprints and casting strategies using live search telemetry.',
    price: 2999.00,
    category: 'AI Agents',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=60',
    in_stock: true,
    rating: 5.0,
    features: ['Multi-Agent Film Orchestration', 'Live Talent Scouting (SerpApi)', 'Cyberpunk Narrative Engine', '3-Act Structure Synthesis', 'Full Source Code Included'],
    specs: { Format: 'Python / Agno', Components: 'Script + Casting + Producer', API: 'Gemini, SerpApi', License: 'Master Resell Rights', Support: 'Priority Support' }
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
