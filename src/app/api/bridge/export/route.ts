import { NextResponse } from 'next/server';
import { SwarmBridgeService } from '@/lib/bridge';

export async function POST(req: Request) {
  try {
    const { tokenId } = await req.json();
    if (!tokenId) return NextResponse.json({ error: 'TokenID required' }, { status: 400 });

    const manifest = await SwarmBridgeService.exportAsset(tokenId);
    if (!manifest) return NextResponse.json({ error: 'Asset untraceable' }, { status: 404 });

    return NextResponse.json(manifest);
  } catch (err) {
    console.error('[BRIDGE_FAULT] Export sequence failed:', err);
    return NextResponse.json({ error: 'Uplink failure' }, { status: 500 });
  }
}
