
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const expansionProducts = [
  {
    name: 'Swarm Finance Infiltrator (xAI Oracle)',
    description: 'A high-speed technical market oracle powered by xAI Grok. Synthesizes real-time stock, crypto, and market metrics into actionable intelligence.',
    price: 2499.00,
    category: 'AI Agents',
    image: 'https://images.unsplash.com/photo-1611974717482-58a25a3d5be0?w=800&auto=format&fit=crop&q=60',
    in_stock: true,
    rating: 5.0,
    features: ['xAI Grok Intelligence', 'Real-time Stock/Crypto Uplink', 'Technical Analysis Engine', 'Market Sentiment Scrape', 'Full Source Code Included'],
    specs: { Format: 'Python / Agno', Components: 'Finance Oracle', API: 'xAI, YFinance', License: 'Master Resell Rights', Support: 'Priority Support' }
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
