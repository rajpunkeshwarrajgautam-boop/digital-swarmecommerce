const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { count, error } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true });
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Database product count:', count);
}

check();
