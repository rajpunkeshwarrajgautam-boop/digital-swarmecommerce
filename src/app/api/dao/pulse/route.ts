import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "DAO pulse analytics are not a production Digital Swarm service." },
    { status: 410 },
  );
}
