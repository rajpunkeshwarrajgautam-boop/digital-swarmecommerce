
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listAll() {
  const { data, error } = await supabase.from('products').select('name');
  if (error) {
    console.error(error);
    return;
  }
  const fs = require('fs');
  fs.writeFileSync('db_products.txt', data.map(p => p.name).join('\n'));
}

listAll();
