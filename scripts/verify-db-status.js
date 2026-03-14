
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key missing in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyDB() {
  console.log('--- Database Verification ---');
  
  // 1. Check for expected products
  const { data: products, error } = await supabase
    .from('products')
    .select('name, price, category');
    
  if (error) {
    console.error('Error fetching products:', error);
  } else {
    console.log(`Found ${products.length} products total.`);
    
    const expectedNames = [
      'Swarm Sales Infiltrator',
      'Swarm Finance Infiltrator',
      'Swarm Cinema Infiltrator'
    ];
    
    expectedNames.forEach(name => {
      const match = products.find(p => p.name.includes(name));
      if (match) {
        console.log(`✅ Found: ${match.name} (Price: ₹${match.price})`);
      } else {
        console.warn(`❌ Missing: ${name}`);
      }
    });
  }

  // 2. Check for God Tier category
  const categories = [...new Set(products?.map(p => p.category) || [])];
  if (categories.some(c => c && c.includes('GOD TIER'))) {
    console.log('✅ "AI Agents (GOD TIER)" category exists.');
  } else {
    console.warn('❌ "AI Agents (GOD TIER)" category not found in product data.');
  }

  process.exit(0);
}

verifyDB();
