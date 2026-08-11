import { NextResponse } from "next/server";

/**
 * Legacy endpoint retained only to make old clients fail explicitly. The
 * tokenized-vault experiment was never a production ownership system. Real
 * customer assets live behind the authenticated licence/account APIs.
 */
export async function GET() {
  return NextResponse.json(
    {
      error: "Legacy vault retired",
      replacement: "/dashboard/assets",
    },
    { status: 410 },
  );
}
