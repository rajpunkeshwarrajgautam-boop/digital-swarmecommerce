
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const expansionProducts = [
  {
    name: 'Swarm Corporate Growth Team (Multi-Agent)',
    description: 'An elite multi-agent team designed for enterprise-level sales intelligence. Coordinates between Lead Infiltrators, Outreach Strategists, and Closing Architects.',
    price: 1999.00,
    category: 'AI Agents',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60',
    in_stock: true,
    rating: 5.0,
    features: ['Lead Scoring Engine', 'Multi-Agent Coordination Logic', 'CRM Integration Ready', 'Automated Outreach Workflows', 'Dashboard Analytics'],
    specs: { Format: 'Python / CrewAI', Components: '3+ Agents', API: 'OpenAI / Claude', License: 'Master Resell Rights', Support: 'Priority Support' }
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
