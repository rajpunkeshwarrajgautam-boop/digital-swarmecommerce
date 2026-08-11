import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Governance proposals are not a supported Digital Swarm service." },
    { status: 410 },
  );
}
