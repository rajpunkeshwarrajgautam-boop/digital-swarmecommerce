import crypto from "crypto";

/**
 * ARCHITECTURAL_BRIDGE: HMAC Signing Protocol
 * Allows external systems to securely communicate with the Digital Swarm.
 */

const BRIDGE_SECRET = process.env.SWARM_BRIDGE_SECRET || "default_swarm_secret_7721";

/**
 * SECURITY_SIGNER: Generates an HMAC signature for a given payload.
 */
export function signBridgeRequest(payload: any): string {
  const data = typeof payload === "string" ? payload : JSON.stringify(payload);
  return crypto
    .createHmac("sha256", BRIDGE_SECRET)
    .update(data)
    .digest("hex");
}

/**
 * SECURITY_VERIFIER: Verifies an incoming HMAC signature.
 */
export function verifyBridgeRequest(payload: any, signature: string): boolean {
  if (!signature) return false;
  
  const expectedSignature = signBridgeRequest(payload);
  
  // Use constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(expectedSignature, "hex")
  );
}

/**
 * INTEROP_PROTOCOL: Standard payload for cross-swarm communication.
 */
export interface BridgePayload {
  nodeId: string;
  action: 'QUERY_LEDGER' | 'VERIFY_IDENTITY' | 'EXECUTE_TASK';
  timestamp: number;
  params: any;
}

/**
 * ARCHITECTURAL_BRIDGE: Centralized service for cross-swarm asset transfer.
 */
export class SwarmBridgeService {
  /**
   * EXPORT: Generates a signed manifest for an asset to be moved to another swarm.
   */
  static async exportAsset(tokenId: string) {
    // In a real scenario, this would fetch from Supabase.
    // For now, we generate a signed manifest for the digital forge.
    const manifest = {
      tokenId,
      origin: "DIGITAL_SWARM_IN",
      timestamp: Date.now(),
      status: "STAGED_FOR_TRANSFER"
    };

    const signature = signBridgeRequest(manifest);
    return { ...manifest, signature };
  }

  /**
   * IMPORT: Verifies and registers an asset coming from another swarm.
   */
  static async importAsset(manifest: any) {
    const { signature, ...payload } = manifest;
    
    const isValid = verifyBridgeRequest(payload, signature);
    if (!isValid) {
      return { success: false, error: "INVALID_SIGNATURE" };
    }

    // Register asset in local registry (Simulated)
    console.log(`[BRIDGE] Asset ${payload.tokenId} imported successfully.`);
    return { success: true };
  }
}

