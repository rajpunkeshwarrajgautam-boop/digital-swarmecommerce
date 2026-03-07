const postgres = require('postgres');

const connectionString = 'postgresql://postgres:DigitalSwarm%402026%21@db.xbjdosyqgznveddlyiqh.supabase.co:5432/postgres';
const sql = postgres(connectionString, { ssl: 'require' });

async function createTables() {
  console.log('Connecting to Supabase Database via direct Postgres...');
  
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS public.affiliates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        audience_link TEXT,
        status TEXT DEFAULT 'pending',
        clicks INT DEFAULT 0,
        earned DECIMAL(10,2) DEFAULT 0.00,
        referral_code TEXT UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `;
    console.log('✅ Created affiliates table.');

    await sql`
      CREATE TABLE IF NOT EXISTS public.customer_licenses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_email TEXT NOT NULL,
        order_id TEXT NOT NULL,
        license_key TEXT NOT NULL UNIQUE,
        license_tier TEXT NOT NULL DEFAULT 'standard',
        product_id TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `;
    console.log('✅ Created customer_licenses table.');

  } catch (error) {
    console.error('❌ Error executing SQL:', error);
  } finally {
    await sql.end();
  }
}

createTables();
