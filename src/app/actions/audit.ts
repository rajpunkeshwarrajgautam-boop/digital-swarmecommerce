"use server";

import { verifyLedgerIntegrity } from "@/lib/ledger";
import { supabaseAdmin } from "@/lib/supabase";
import { signBridgeRequest } from "@/lib/bridge";

export interface AuditResult {
  ledgerIntegrity: boolean;
  totalBlocks: number;
  anomalies: number;
  nodeVerification: boolean;
  timestamp: string;
  certificateHash: string;
}

/**
 * PROTOCOL_AUDIT_ENGINE: Executes a full cryptographic scan of the Digital Swarm.
 */
export async function runProtocolAudit(): Promise<AuditResult> {
  if (!supabaseAdmin) throw new Error("DATABASE_UNAVAILABLE");

  // 1. [CRYPTO_SCAN] Verify Ledger Chain
  const ledgerStatus = await verifyLedgerIntegrity();
  
  // 2. [ANOMALY_DETECTION] Check for Trust Score drift
  const { data: nodes } = await supabaseAdmin
    .from("swarm_nodes")
    .select("id, trust_score")
    .lt("trust_score", 0); // Trust scores should never be negative
  
  const anomalies = nodes?.length || 0;

  // 3. [NODE_VERIFICATION] Check for unverified merchants
  const { count: unverifiedCount } = await supabaseAdmin
    .from("swarm_nodes")
    .select("*", { count: "exact", head: true })
    .eq("is_verified", false);

  // 4. [CERTIFICATION] Generate Audit Proof
  const timestamp = new Date().toISOString();
  const certificateHash = signBridgeRequest({
    ledgerIntegrity: ledgerStatus.valid,
    totalBlocks: ledgerStatus.totalBlocks || 0,
    timestamp
  });

  return {
    ledgerIntegrity: ledgerStatus.valid,
    totalBlocks: ledgerStatus.totalBlocks || 0,
    anomalies,
    nodeVerification: (unverifiedCount || 0) === 0,
    timestamp,
    certificateHash
  };
}
