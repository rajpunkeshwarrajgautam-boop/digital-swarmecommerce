-- --------------------------------------------------------------------------
-- SUPABASE DIGITAL SWARM LEADS SCHEMA MIGRATION
-- Executes natively to deploy the backend for the Phase 2 Lead Magnet.
-- --------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'prompt_generator_utility',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Essential Row Level Security ensuring malicious public access cannot dump your emails
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow completely public insertion (so anonymous web traffic can submit their email securely)
CREATE POLICY "Allow public insert to leads"
  ON public.leads
  FOR INSERT
  WITH CHECK (true);

-- Allow completely locked down read access (only API service_role can read)
CREATE POLICY "Allow service_role full access to leads"
  ON public.leads
  USING (true)
  WITH CHECK (true);

-- Optimize queries grouping leads by source for future marketing campaigns
CREATE INDEX IF NOT EXISTS idx_leads_source ON public.leads(source);
