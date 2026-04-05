import { NextResponse } from 'next/server';
import { TokenService } from '@/lib/token-minting';
import { currentUser } from '@clerk/nextjs/server';

/**
 * 🎁 SECURE TRANSFER UPLINK
 * ----------------------------
 * Handles the P2P transfer of tokenized digital assets.
 * Only validated owners can initiate a broadcast.
 */
export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Auth context required' }, { status: 401 });
    }

    const { tokenId, toEmail, price } = await req.json();

    if (!tokenId || !toEmail) {
      return NextResponse.json({ error: 'Incomplete transfer metadata' }, { status: 400 });
    }

    // 🏗️ Execute Secondary Transfer Protocol
    const result = await TokenService.transferToken(tokenId, user.id, toEmail, price || 0);

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Ownership broadcast successfully confirmed by swarm network.' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: result.message 
      }, { status: 403 });
    }

  } catch (err) {
    console.error('[TRANSFER_API_FAULT] Internal logic failure:', err);
    return NextResponse.json({ error: 'Internal Core Sync Fault' }, { status: 500 });
  }
}
