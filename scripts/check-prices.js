
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkPrices() {
  const { data, error } = await supabase.from('products').select('name, price');
  if (error) {
    console.error(error);
    return;
  }
  data.forEach(p => console.log(`${p.name}: ₹${p.price}`));
}

checkPrices();
