
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const fulfillmentMaps = [
  { name: 'Sentinel Research Infiltrator (AI Agent)', url: '/downloads/sentinel-research.zip' },
  { name: 'Swarm Corporate Growth Team (Multi-Agent)', url: '/downloads/swarm-sales.zip' },
  { name: 'Swarm Finance Infiltrator (xAI Oracle)', url: '/downloads/swarm-finance.zip' },
  { name: 'Swarm Cinema Infiltrator (AI Movie Producer)', url: '/downloads/swarm-cinema.zip' },
  { name: '1000 Manually Tested Web Applications', url: '/downloads/1000-web-apps.pdf' },
  { name: 'Ultimate Web Development Bundle', url: '/downloads/ultimate-web-bundle.pdf' },
  { name: 'Ultimate Mega Bundle', url: '/downloads/mega-bundle.pdf' },
  { name: 'Web Applications Collection', url: '/downloads/web-apps-collection.pdf' }
];

async function activateFulfillment() {
  console.log("🚀 TERMINATING MOCK STATUS: ACTIVATING REAL-TIME FULFILLMENT...");
  for (const item of fulfillmentMaps) {
    const { error } = await supabase
      .from('products')
      .update({ download_url: item.url })
      .eq('name', item.name);
    
    if (error) console.error(`Error activating ${item.name}:`, error.message);
    else console.log(`✅ ${item.name} is now LIVE and DOWNLOADABLE.`);
  }
}

activateFulfillment();
