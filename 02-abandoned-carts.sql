-- 02-abandoned-carts.sql
-- Run this in your Supabase SQL Editor

CREATE TABLE public.abandoned_carts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    cart_data JSONB NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'emailed', 'recovered', 'lost')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (from the frontend checkout tracker before payment)
CREATE POLICY "Allow anonymous inserts to abandoned_carts" ON public.abandoned_carts
    FOR INSERT TO anon
    WITH CHECK (true);

-- Allow authenticated edge functions / cron jobs to read/update
CREATE POLICY "Allow service role to manage abandoned_carts" ON public.abandoned_carts
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Create a function to auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_abandoned_carts_modtime
    BEFORE UPDATE ON public.abandoned_carts
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();
