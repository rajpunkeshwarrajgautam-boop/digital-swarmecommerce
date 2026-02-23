
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkFulfillment() {
  const { data, error } = await supabase.from('products').select('name, download_url');
  if (error) {
    console.error(error);
    return;
  }
  console.log("--- FULFILLMENT AUDIT ---");
  data.forEach(p => {
    console.log(`Product: ${p.name}`);
    console.log(`Download URL: ${p.download_url || 'MISSING (MOCK STATUS)'}`);
    console.log('-------------------------');
  });
}

checkFulfillment();
