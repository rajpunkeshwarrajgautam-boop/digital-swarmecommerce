/**
 * 🛸 SWARM NODE REGISTRY
 * ---------------------
 * Manages the identity and region of the current deployment node.
 */

export interface NodeMetadata {
  id: string;
  region: string;
  isEdge: boolean;
  version: string;
}

const DEFAULT_NODE_ID = "ZERO_PRIME_ALPHA";
const VERSION = "1.2.4-stable";

/**
 * Retrieves the identity and current location of the swarm node.
 * Uses Vercel's x-vercel-ip-country or fallback.
 */
export const getNodeIdentity = (headers?: Headers): NodeMetadata => {
  const nodeId = process.env.SWARM_NODE_ID || DEFAULT_NODE_ID;
  const region = headers?.get("x-vercel-ip-country") || "LOC";
  const isEdge = process.env.NEXT_RUNTIME === "edge" || !!process.env.VERCEL_EDGE_REGION;

  return {
    id: nodeId,
    region,
    isEdge,
    version: VERSION,
  };
};

/**
 * Returns a short formatted identifier for UI/Receipts.
 * E.g., @ZERO_PRIME_ALPHA-LOC
 */
export const getShortNodeTag = (node: NodeMetadata): string => {
  return `@${node.id}-${node.region.substring(0, 3).toUpperCase()}`;
};
