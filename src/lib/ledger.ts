import { supabaseAdmin } from "./supabase";
import crypto from "crypto";

export interface LedgerEntry {
  transactionId: string;
  payload: any;
}

/**
 * ARCHITECTURAL_PROTOCOL: Cryptographic Sealing Engine
 * Ensures that every transaction is chained to the previous entry using SHA-256 hashes.
 */
export async function sealTransaction(data: LedgerEntry) {
  if (!supabaseAdmin) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  // 1. Fetch the hash of the latest entry to maintain the chain
  const { data: latestEntry, error: fetchError } = await supabaseAdmin
    .from("protocol_ledger")
    .select("hash")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fetchError) {
    console.error("[LEDGER_FETCH_ERROR]:", fetchError);
  }

  const previousHash = latestEntry?.hash || "GENESIS_BLOCK_00000000000000000000000000000000";

  // 2. Generate SHA-256 Hash of (Current Payload + Previous Hash)
  const hashSource = JSON.stringify(data.payload) + previousHash;
  const hash = crypto.createHash("sha256").update(hashSource).digest("hex");

  // 3. Persist to Immutable Ledger
  const { error: insertError } = await supabaseAdmin
    .from("protocol_ledger")
    .insert({
      transaction_id: data.transactionId,
      payload: data.payload,
      previous_hash: previousHash,
      hash: hash,
      created_at: new Date().toISOString()
    });

  if (insertError) {
    console.error("[LEDGER_SEAL_ERROR]:", insertError);
    throw new Error("LEDGER_INTEGRITY_COMPROMISED");
  }

  return { success: true, hash, previousHash };
}

/**
 * SECURITY_PROTOCOL: Ledger Audit
 * Iterates through the entire chain to verify cryptographic integrity.
 */
export async function verifyLedgerIntegrity() {
  if (!supabaseAdmin) return { valid: false, error: "DB_OFFLINE" };

  const { data: entries, error } = await supabaseAdmin
    .from("protocol_ledger")
    .select("*")
    .order("created_at", { ascending: true });

  if (error || !entries) return { valid: false, error: "AUDIT_FETCH_FAILED" };

  let lastHash = "GENESIS_BLOCK_00000000000000000000000000000000";

  for (const entry of entries) {
    const calculatedHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(entry.payload) + entry.previous_hash)
      .digest("hex");

    if (calculatedHash !== entry.hash || entry.previous_hash !== lastHash) {
      return { valid: false, error: "TAMPER_DETECTED", blockId: entry.id };
    }
    lastHash = entry.hash;
  }

  return { valid: true, totalBlocks: entries.length };
}
