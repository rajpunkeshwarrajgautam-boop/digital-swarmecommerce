import { NextResponse } from "next/server";
import { SwarmBridgeService, verifyBridgeAuthorization } from "@/lib/bridge";

export async function POST(req: Request) {
  try {
    if (!verifyBridgeAuthorization(req.headers.get("authorization"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const tokenId = typeof body?.tokenId === "string" ? body.tokenId.trim() : "";
    if (!tokenId || tokenId.length > 160) {
      return NextResponse.json({ error: "Valid tokenId required" }, { status: 400 });
    }

    const manifest = await SwarmBridgeService.exportAsset(tokenId);
    return NextResponse.json(manifest);
  } catch (err) {
    console.error("[BRIDGE_FAULT] Export sequence failed:", err);
    return NextResponse.json({ error: "Uplink failure" }, { status: 500 });
  }
}
