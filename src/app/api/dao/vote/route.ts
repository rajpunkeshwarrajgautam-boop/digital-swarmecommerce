import { NextResponse } from 'next/server';
import { GovernanceService } from '@/lib/governance';
import { currentUser } from '@clerk/nextjs/server';

/**
 * 🗳️ VOTE BROADCAST UPLINK
 * ----------------------------
 * Every verified artifact owner can cast their weight.
 */
export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Auth context required' }, { status: 401 });
    }

    const { proposalId, voteType } = await req.json();

    if (!proposalId || !voteType) {
      return NextResponse.json({ error: 'Incomplete vote metadata' }, { status: 400 });
    }

    // 🏗️ Execute Decision Engine
    const result = await GovernanceService.castVote(user.id, proposalId, voteType);

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        weight: result.weight,
        message: `Decision successfully broadcast. ${result.weight} units of governance weight applied.` 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Insufficient Weight: You must own at least one verified artifact (DST) to vote.' 
      }, { status: 403 });
    }

  } catch (err) {
    console.error('[DAO_API_FAULT] Internal logic failure:', err);
    return NextResponse.json({ error: 'Internal Core Sync Fault' }, { status: 500 });
  }
}
