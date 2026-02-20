import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://uhswcljouelyprsinchj.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoc3djbGpvdWVseXByc2luY2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTMzNDY3OCwiZXhwIjoyMDg2OTEwNjc4fQ.XyhD3yOO6wJY6_9ola6HQodgPipvDqoVxWbnCmmtQG0';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function fixInStock() {
  console.log('🔍 Fetching all products...');
  
  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('id, name, in_stock');
  
  if (fetchError) {
    console.error('❌ Error fetching products:', fetchError.message);
    process.exit(1);
  }

  console.log(`Found ${products.length} products:`);
  products.forEach(p => console.log(`  - ${p.name}: in_stock=${p.in_stock}`));

  console.log('\n✏️  Updating all products to in_stock=true...');
  
  const { data: updated, error: updateError } = await supabase
    .from('products')
    .update({ in_stock: true })
    .neq('in_stock', true)  // only update ones that aren't already true
    .select('id, name, in_stock');
  
  if (updateError) {
    console.error('❌ Error updating products:', updateError.message);
    // Try updating ALL products regardless
    console.log('Trying to update ALL products...');
    const { data: all, error: allErr } = await supabase
      .from('products')
      .update({ in_stock: true })
      .gte('id', '00000000-0000-0000-0000-000000000000')
      .select();
    if (allErr) {
      console.error('❌ Still failing:', allErr.message);
      process.exit(1);
    }
    console.log('✅ Updated all products:', all?.length);
    return;
  }

  console.log(`\n✅ Updated ${updated?.length ?? 0} products to in_stock=true`);

  // Verify
  const { data: verify } = await supabase.from('products').select('id, name, in_stock');
  console.log('\n📋 Final state:');
  verify?.forEach(p => console.log(`  ✅ ${p.name}: in_stock=${p.in_stock}`));
}

fixInStock();
