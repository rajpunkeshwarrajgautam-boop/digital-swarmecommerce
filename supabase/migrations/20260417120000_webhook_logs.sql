-- Webhook audit trail for Cashfree (idempotency + observability).
-- Apply via Supabase Dashboard SQL or: supabase db push (linked project).
-- Uses gen_random_uuid() (built-in) — no uuid-ossp extension required.

CREATE TABLE IF NOT EXISTS public.webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cf_order_id TEXT NOT NULL,
  cf_payment_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  raw_payload JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'pending',
  processed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  UNIQUE (cf_payment_id, event_type)
);

CREATE INDEX IF NOT EXISTS idx_webhook_logs_order_id ON public.webhook_logs (cf_order_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_payment_id ON public.webhook_logs (cf_payment_id);

ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

-- Client keys cannot read/write; API routes use service_role (bypasses RLS).
