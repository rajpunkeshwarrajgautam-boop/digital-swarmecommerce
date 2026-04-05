import { NextResponse } from 'next/server';
import { SwarmBridgeService } from '@/lib/bridge';

export async function POST(req: Request) {
  try {
    const manifest = await req.json();
    if (!manifest || !manifest.tokenId || !manifest.signature) {
      return NextResponse.json({ error: 'Manifest corrupt. Registry untrusted.' }, { status: 400 });
    }

    const result = await SwarmBridgeService.importAsset(manifest);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    return NextResponse.json({ 
      success: true, 
      sync_at: new Date().toISOString() 
    });

  } catch (err) {
    console.error('[BRIDGE_FAULT] Import synchronization failure:', err);
    return NextResponse.json({ error: 'Uplink synchronization failure' }, { status: 500 });
  }
}
