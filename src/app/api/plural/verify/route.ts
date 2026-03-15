import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ 
    error: 'Plural Verification Service is under maintenance. All transactions are currently routed through Cashfree.',
  }, { status: 503 });
}
