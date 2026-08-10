import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "Governance experiment retired", replacement: "/about" },
    { status: 410 },
  );
}
