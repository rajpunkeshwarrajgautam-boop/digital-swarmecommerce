import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Finalizing Payment Schema Hardening...');
  
  const { error } = await supabase.rpc('execute_sql', {
    sql_query: `
      -- 1. Hardening Orders Table
      alter table public.orders add column if not exists payment_id text;
      alter table public.orders add column if not exists customer_name text;
      alter table public.orders add column if not exists customer_phone text;
      
      -- 2. Hardening Licenses Table (Unique constraint for security)
      -- Check if constraint exists, if not add it
      do $$
      begin
        if not exists (select 1 from pg_constraint where conname = 'unique_order_product') then
          alter table public.customer_licenses add constraint unique_order_product unique (order_id, product_id);
        end if;
      end $$;

      grant all on public.customer_licenses to service_role;
      grant all on public.orders to service_role;
    `
  });

  if (error) {
    console.error('Migration failed:', error);
  } else {
    console.log('Payment schema hardened successfully!');
  }
}

run();
