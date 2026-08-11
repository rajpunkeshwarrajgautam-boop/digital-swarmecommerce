import { NextResponse } from "next/server";

/**
 * Secondary token transfers are not part of Digital Swarm's supported licence
 * model. The former implementation generated a recipient ID from an email
 * address and therefore was not a real identity/ownership transfer system.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: "Asset transfer is not supported",
      message: "Digital Swarm licences are governed by the published licence terms and cannot be transferred through this legacy endpoint.",
    },
    { status: 410 },
  );
}
