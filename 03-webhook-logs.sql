-- Create Webhook Logs Table for Resiliency
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cf_order_id TEXT NOT NULL,
  cf_payment_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  raw_payload JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending',
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  
  -- Prevent exact duplicate logs for the same payment session
  UNIQUE(cf_payment_id, event_type)
);

-- Index for fast lookup by order ID
CREATE INDEX IF NOT EXISTS idx_webhook_logs_order_id ON webhook_logs(cf_order_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_payment_id ON webhook_logs(cf_payment_id);

-- Explicitly allow service_role bypass for logging
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON webhook_logs FOR ALL USING (true);
