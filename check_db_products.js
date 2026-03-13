
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
  const { data, error, count } = await supabase
    .from('products')
    .select('id, name, price, category', { count: 'exact' });

  if (error) {
    console.error("Error fetching products:", error);
  } else {
    console.log(`Found ${count} products in Supabase:`);
    console.table(data);
  }
}

checkProducts();
