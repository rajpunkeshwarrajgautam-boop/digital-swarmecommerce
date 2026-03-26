const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function sync() {
  console.log("Checking orders table schema...");
  
  // 1. Check if column exists
  const { data: columns, error: colError } = await supabase.rpc('get_columns', { table_name: 'orders' });
  
  // Fallback: If RPC not available, try a dummy insert/select
  const { error: checkError } = await supabase
    .from('orders')
    .select('cashfree_order_id')
    .limit(1);

  if (checkError && checkError.message.includes('column "cashfree_order_id" does not exist')) {
    console.log("Column 'cashfree_order_id' missing. Adding now...");
    
    // Use SQL RPC if available, or notify user to run SQL
    const { error: sqlError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE orders ADD COLUMN IF NOT EXISTS cashfree_order_id TEXT;'
    });

    if (sqlError) {
      console.error("SQL Error (manual intervention might be needed):", sqlError.message);
      console.log("--- SQL COMMAND TO RUN MANUALLY IN SUPABASE DASHBOARD ---");
      console.log("ALTER TABLE orders ADD COLUMN IF NOT EXISTS cashfree_order_id TEXT;");
      console.log("ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_session_id TEXT;");
      console.log("---------------------------------------------------------");
    } else {
      console.log("Successfully added 'cashfree_order_id'!");
    }
  } else if (!checkError) {
    console.log("Column 'cashfree_order_id' already exists. Remote schema is synchronized.");
  } else {
    console.error("Unknown DB error:", checkError.message);
  }
}

sync();
