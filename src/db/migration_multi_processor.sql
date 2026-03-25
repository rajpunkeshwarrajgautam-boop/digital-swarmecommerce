-- ENSURE RLS POLICIES FOR PRODUCTS TABLE
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Allow service_role full access') THEN
        CREATE POLICY "Allow service_role full access" ON public.products FOR ALL TO service_role USING (true);
    END IF;
END $$;

-- ADD MULTI-PROCESSOR COLUMNS TO ORDERS TABLE
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT UNIQUE;

-- ENSURE INDEXES FOR FAST LOOKUP DURING VERIFICATION
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON public.orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id ON public.orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_cashfree_order_id ON public.orders(cashfree_order_id);
