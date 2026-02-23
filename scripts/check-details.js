
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDetails() {
  const { data, error } = await supabase.from('products').select('name, image, download_url');
  if (error) {
    console.error(error);
    return;
  }
  const targets = [
    '1000 Manually Tested Web Applications',
    'Ultimate Web Development Bundle',
    'Ultimate Mega Bundle',
    'Web Applications Collection'
  ];
  const filtered = data.filter(p => targets.includes(p.name));
  fs.writeFileSync('product_details.json', JSON.stringify(filtered, null, 2));
}

checkDetails();
