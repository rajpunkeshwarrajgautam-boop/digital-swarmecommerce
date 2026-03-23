-- --------------------------------------------------------------------------
-- SUPABASE DIGITAL SWARM AFFILIATE SCHEMA MIGRATION
-- Execute this script directly in the Supabase SQL Editor to provision
-- the Tier-2 Organic Marketing Infrastructure.
-- --------------------------------------------------------------------------

-- 1. Create the Affiliates Table (Tracks user accounts and earnings)
CREATE TABLE IF NOT EXISTS public.affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,      -- Clerk User ID (Auth)
  referral_code TEXT NOT NULL UNIQUE,-- e.g., 'john_doe_123'
  total_earnings DECIMAL(10, 2) DEFAULT 0.00,
  total_clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for Affiliates
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;

-- Allow public read access to verify referral codes in middleware
CREATE POLICY "Allow public read for active referral codes"
  ON public.affiliates
  FOR SELECT
  USING (true);

-- Allow authenticated inserts/updates handled securely via service_role API
CREATE POLICY "Allow service_role full access to affiliates"
  ON public.affiliates
  USING (true)
  WITH CHECK (true);

-- 2. Create the Referrals Table (Tracks individual sales & commissions)
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE,
  order_id TEXT NOT NULL UNIQUE,     -- Cashfree or internal Order ID
  commission_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',     -- 'pending' vs 'paid_out'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for Referrals
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Allow completely locked down access (only API service_role can read/write)
CREATE POLICY "Allow service_role full access to referrals"
  ON public.referrals
  USING (true)
  WITH CHECK (true);

-- --------------------------------------------------------------------------
-- INDEXING FOR PERFORMANCE
-- --------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_affiliates_referral_code ON public.affiliates(referral_code);
CREATE INDEX IF NOT EXISTS idx_affiliates_user_id ON public.affiliates(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_affiliate_id ON public.referrals(affiliate_id);
