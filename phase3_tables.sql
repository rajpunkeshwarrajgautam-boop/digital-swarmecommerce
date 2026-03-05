-- ==============================================
-- PHASE 3 SCALING TABLES: DASHBOARD & AFFILIATE
-- Run this in your Supabase SQL Editor
-- ==============================================

-- 1. Create customer_licenses table for the Secure JWT Portal
CREATE TABLE IF NOT EXISTS public.customer_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    order_id TEXT NOT NULL,
    license_key TEXT NOT NULL UNIQUE,
    license_tier TEXT NOT NULL DEFAULT 'standard',
    product_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.customer_licenses ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'customer_licenses' AND policyname = 'Users can view their own licenses'
) THEN
    CREATE POLICY "Users can view their own licenses" 
    ON public.customer_licenses 
    FOR SELECT USING (true);
END IF;
END $$;


-- 2. Create affiliates table for the Affiliate & Influencer Portal
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

ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;

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
END $$;
