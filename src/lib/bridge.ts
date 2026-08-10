import crypto from "crypto";

function getBridgeSecret(): string {
  const secret = process.env.SWARM_BRIDGE_SECRET?.trim();
  if (!secret || secret.length < 32) {
    throw new Error("SWARM_BRIDGE_SECRET must be configured with at least 32 characters");
  }
  return secret;
}

function safeEqualHex(actual: string, expected: string): boolean {
  if (!/^[a-f0-9]+$/i.test(actual) || actual.length !== expected.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(actual, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

/** Generate an HMAC-SHA256 signature for a bridge payload. */
export function signBridgeRequest(payload: unknown): string {
  const data = typeof payload === "string" ? payload : JSON.stringify(payload);
  return crypto.createHmac("sha256", getBridgeSecret()).update(data).digest("hex");
}

/** Verify a bridge payload signature with a constant-time comparison. */
export function verifyBridgeRequest(payload: unknown, signature: string): boolean {
  if (!signature) return false;
  const expectedSignature = signBridgeRequest(payload);
  return safeEqualHex(signature, expectedSignature);
}

/** Verify the authorization header used by bridge control endpoints. */
export function verifyBridgeAuthorization(authorization: string | null): boolean {
  if (!authorization?.startsWith("Bearer ")) return false;
  const candidate = authorization.slice(7).trim();
  const expected = getBridgeSecret();
  if (candidate.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(expected));
}

export interface BridgePayload {
  nodeId: string;
  action: "QUERY_LEDGER" | "VERIFY_IDENTITY" | "EXECUTE_TASK";
  timestamp: number;
  params: unknown;
}

export class SwarmBridgeService {
  static async exportAsset(tokenId: string) {
    const manifest = {
      tokenId,
      origin: "DIGITAL_SWARM_IN",
      timestamp: Date.now(),
      status: "STAGED_FOR_TRANSFER",
    };

    const signature = signBridgeRequest(manifest);
    return { ...manifest, signature };
  }

  static async importAsset(manifest: Record<string, unknown>) {
    const { signature, ...payload } = manifest;
    if (typeof signature !== "string" || !verifyBridgeRequest(payload, signature)) {
      return { success: false, error: "INVALID_SIGNATURE" };
    }

    return { success: true };
  }
}
