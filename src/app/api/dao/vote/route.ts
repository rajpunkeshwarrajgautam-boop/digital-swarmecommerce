import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Token-weighted governance voting is not a supported Digital Swarm service." },
    { status: 410 },
  );
}
