-- Protocol Integrity Ledger Table
-- Purpose: Immutable cryptographic audit trail for all Digital Swarm financial movements.

CREATE TABLE IF NOT EXISTS public.protocol_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id TEXT NOT NULL, -- Refers to order_id or commission_id
    payload JSONB NOT NULL, -- Snapshot of the data (amounts, IDs)
    previous_hash TEXT, -- Hash of the previous block
    hash TEXT NOT NULL, -- SHA-256 of (payload + previous_hash)
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Indexing for chain traversal
CREATE INDEX IF NOT EXISTS idx_ledger_transaction_id ON public.protocol_ledger (transaction_id);
CREATE INDEX IF NOT EXISTS idx_ledger_hash ON public.protocol_ledger (hash);
CREATE INDEX IF NOT EXISTS idx_ledger_created_at ON public.protocol_ledger (created_at);

-- Security: Ledger is read-only for public, restricted for writes.
ALTER TABLE public.protocol_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Protocol ledger is publicly auditable" ON public.protocol_ledger
    FOR SELECT
    USING (true);

-- System-only inserts (Service Role)
