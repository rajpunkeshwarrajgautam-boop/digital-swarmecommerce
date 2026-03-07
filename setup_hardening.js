const postgres = require('postgres');
require('dotenv').config();

// SUPABASE_SERVICE_ROLE_KEY is already present in .env
// We need the postgres connection string. I'll get it from the metadata or construct it.
// Supabase Dashboard -> Project Settings -> Database -> Connection String
// Example: postgres://postgres:[password]@db.xbjdosyqgznveddlyiqh.supabase.co:5432/postgres

const connectionString = 'postgresql://postgres:DigitalSwarm%402026%21@db.xbjdosyqgznveddlyiqh.supabase.co:5432/postgres';
const sql = postgres(connectionString, { ssl: 'require' });

async function hardening() {
  console.log('--- HARDENING DATABASE RLS POLICIES ---');
  try {
    // 1. Customer Licenses Hacking Prevention
    await sql`ALTER TABLE public.customer_licenses ENABLE ROW LEVEL SECURITY;`;
    await sql`DROP POLICY IF EXISTS "Users can view their own licenses" ON public.customer_licenses;`;
    console.log('✅ Hardened customer_licenses: Removed public select access.');

    // 2. Affiliate Application Protection
    await sql`ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;`;
    await sql`DROP POLICY IF EXISTS "Anyone can insert application" ON public.affiliates;`;
    await sql`CREATE POLICY "Anyone can insert application" ON public.affiliates FOR INSERT WITH CHECK (true);`;
    await sql`DROP POLICY IF EXISTS "Affiliates can view their stats" ON public.affiliates;`;
    console.log('✅ Hardened affiliates: Public can only INSERT. Reading stats now strictly Service-Role only.');

    // 3. Products Public Read
    await sql`ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;`;
    await sql`DROP POLICY IF EXISTS "Public products are viewable by everyone" ON public.products;`;
    await sql`CREATE POLICY "Public products are viewable by everyone" ON public.products FOR SELECT USING (true);`;
    console.log('✅ Confirmed products: Public read access enabled.');

  } catch (err) {
    console.error('❌ Database Hardening Failed:', err.message);
  } finally {
    await sql.end();
  }
}

hardening();
