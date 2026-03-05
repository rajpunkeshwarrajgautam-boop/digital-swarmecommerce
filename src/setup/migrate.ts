import { supabaseAdmin } from '../lib/supabase';
import fs from 'fs';
import path from 'path';

async function migrate() {
  console.log('🚀 INITIALIZING DATABASE MIGRATION...');

  const sqlPath = path.join(process.cwd(), 'src/db/migration_cashfree.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  // Supabase JS client doesn't have a direct 'query' or 'unsafe' method for raw SQL.
  // We usually have to run this in the Supabase Dashboard SQL Editor.
  // However, we can try to use a workaround if the 'rpc' method is available for raw queries (deprecated/restricted usually).
  
  console.log('--- PLEASE RUN THE FOLLOWING SQL IN YOUR SUPABASE DASHBOARD SQL EDITOR ---');
  console.log(sql);
  console.log('-----------------------------------------------------------------------');
  
  // Alternatively, we can check if the columns exist by trying to select them
  const { error } = await supabaseAdmin.from('orders').select('cashfree_order_id').limit(1);
  if (error) {
    console.log('❌ DATABASE NEEDS UPDATE: Columns missing.');
  } else {
    console.log('✅ DATABASE VERIFIED: Columns already exist.');
  }
}

migrate();
