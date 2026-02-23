
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, anonKey);
const supabaseAdmin = createClient(supabaseUrl, serviceKey);

async function testRLS() {
  console.log("--- Testing with ANON KEY ---");
  const { data: anonData, error: anonError } = await supabase.from('products').select('name');
  if (anonError) console.error(anonError.message);
  else console.log(`Anon sees ${anonData.length} products:`, anonData.map(p => p.name));

  console.log("\n--- Testing with SERVICE ROLE KEY ---");
  const { data: adminData, error: adminError } = await supabaseAdmin.from('products').select('name');
  if (adminError) console.error(adminError.message);
  else console.log(`Admin sees ${adminData.length} products:`, adminData.map(p => p.name));
}

testRLS();
