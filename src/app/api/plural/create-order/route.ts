import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ 
    error: 'Plural (Pine Labs) is currently under maintenance. Please use the Cashfree payment option.',
    suggestedAction: 'Switch to Cashfree'
  }, { status: 503 });
}
