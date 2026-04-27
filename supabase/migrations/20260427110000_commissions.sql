-- Automated Commission & Payout Tracking Table
-- Purpose: Records financial splits for Merchants and Affiliates upon successful orders.

CREATE TYPE commission_status AS ENUM ('pending', 'settled', 'disputed');

CREATE TABLE IF NOT EXISTS public.commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL, -- Reference to gateway order_id (e.g. cf_order_id)
    merchant_id TEXT NOT NULL, -- Clerk User ID of the product owner
    affiliate_id TEXT, -- Clerk User ID of the referring affiliate (optional)
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    merchant_share NUMERIC(10, 2) NOT NULL DEFAULT 0,
    affiliate_share NUMERIC(10, 2) NOT NULL DEFAULT 0,
    platform_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    status commission_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance & dashboard queries
CREATE INDEX IF NOT EXISTS idx_commissions_merchant_id ON public.commissions (merchant_id);
CREATE INDEX IF NOT EXISTS idx_commissions_affiliate_id ON public.commissions (affiliate_id);
CREATE INDEX IF NOT EXISTS idx_commissions_order_id ON public.commissions (order_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON public.commissions (status);

-- Security: Enable RLS
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

-- Policy: Merchants can view their own commissions
CREATE POLICY "Merchants can view own commissions" ON public.commissions
    FOR SELECT
    USING (auth.uid()::text = merchant_id);

-- Policy: Affiliates can view their own commissions
CREATE POLICY "Affiliates can view own commissions" ON public.commissions
    FOR SELECT
    USING (auth.uid()::text = affiliate_id);

-- Note: Inserter/Admin bypasses RLS via service_role key in API routes.
