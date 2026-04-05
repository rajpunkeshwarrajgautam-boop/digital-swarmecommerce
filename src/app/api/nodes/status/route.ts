import { NextResponse } from 'next/server';
import { getNodeIdentity } from '@/lib/nodes';

export const runtime = 'edge';

/**
 * 💓 SWARM HEARTBEAT 
 * -------------------
 * Returns the identity and health status of the node that handled the request.
 * Can be called from the dashboard to verify the Swarm's distributed health.
 */
export async function GET(request: Request) {
  const node = getNodeIdentity(request.headers);

  return NextResponse.json({
    status: 'ACTIVE',
    node_id: node.id,
    region: node.region,
    is_edge: node.isEdge,
    protocol_version: node.version,
    heartbeat: new Date().toISOString(),
    network_latency: 'LOW',
  }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Node-Id': node.id,
      'X-Swarm-Region': node.region,
    }
  });
}
