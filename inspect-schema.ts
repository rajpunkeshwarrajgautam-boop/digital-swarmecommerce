import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function inspectSchema() {
  console.log("🔍 INSPECTING_SCHEMA: Checking product table metadata...");
  
  const { data, error } = await supabase.rpc('get_table_columns', { table_name_input: 'products' });

  if (error) {
    // Fallback: try to select one row and check types
    console.log("   ⚠️ RPC 'get_table_columns' failed. Attempting direct query...");
    const { data: rows, error: queryError } = await supabase.from('products').select('*').limit(1);
    
    if (queryError) {
      console.error("   ❌ FAILED: Could not query products table.", queryError);
      return;
    }
    
    if (rows && rows.length > 0) {
       console.log("   ✅ Row Sample:", rows[0]);
    } else {
       console.log("   ℹ️ Table is empty. No rows to inspect.");
    }
  } else {
    console.log("   ✅ Columns:", data);
  }
}

inspectSchema().catch(console.error);
