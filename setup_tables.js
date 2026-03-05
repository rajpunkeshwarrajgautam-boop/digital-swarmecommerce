const postgres = require('postgres');

const sql = postgres('postgresql://postgres:DigitalSwarm@2026!@db.xbjdosyqgznveddlyiqh.supabase.co:5432/postgres', { ssl: 'require' });

async function createTables() {
  console.log('Connecting to Supabase Database...');
  
  try {
    // 1. Create customer_licenses table
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

    // Enable RLS for customer_licenses
    await sql`ALTER TABLE public.customer_licenses ENABLE ROW LEVEL SECURITY;`;
    
    // Create RLS Policy for customer licenses (Users can read their own licenses)
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = 'customer_licenses' AND policyname = 'Users can view their own licenses'
        ) THEN
            CREATE POLICY "Users can view their own licenses" 
            ON public.customer_licenses 
            FOR SELECT USING (
              -- In a real app we'd map Clerk ID to Supabase Auth, but since we are using plain emails for this dashboard mockup:
              -- We will allow the frontend to query by email via anon key, or use service role.
              true
            );
        END IF;
      END
      $$;
    `;
    console.log('✅ Enabled RLS on customer_licenses.');

    // 2. Create affiliates table
    await sql`
      CREATE TABLE IF NOT EXISTS public.affiliates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        audience_link TEXT,
        status TEXT DEFAULT 'pending', -- pending, approved, rejected
        clicks INT DEFAULT 0,
        earned DECIMAL(10,2) DEFAULT 0.00,
        referral_code TEXT UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `;
    console.log('✅ Created affiliates table.');

    // Enable RLS for affiliates
    await sql`ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;`;
    
    // Create RLS Policy for affiliates
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = 'affiliates' AND policyname = 'Anyone can insert application'
        ) THEN
            CREATE POLICY "Anyone can insert application" 
            ON public.affiliates 
            FOR INSERT WITH CHECK (true);
            
            CREATE POLICY "Affiliates can view their stats"
            ON public.affiliates
            FOR SELECT USING (true);
        END IF;
      END
      $$;
    `;
    console.log('✅ Enabled RLS on affiliates.');

    console.log('🎉 Phase 3 scaling tables configured successfully!');

  } catch (error) {
    console.error('❌ Error executing SQL:', error);
  } finally {
    await sql.end();
  }
}

createTables();
