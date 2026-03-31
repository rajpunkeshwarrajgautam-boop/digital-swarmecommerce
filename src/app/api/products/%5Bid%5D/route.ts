import { NextResponse } from 'next/server';

/**
 * DEPRECATED: This route handler was created with a URL-encoded path.
 * Next.js 15 and the Digital Swarm architecture now use the standard [id] directory.
 */
export async function GET() {
  return new NextResponse(
    JSON.stringify({ error: 'Route Deprecated', use: '/api/products/[id]' }),
    { status: 410, headers: { 'Content-Type': 'application/json' } }
  );
}
