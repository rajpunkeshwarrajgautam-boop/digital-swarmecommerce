import { NextResponse } from "next/server";
import { SwarmBridgeService, verifyBridgeAuthorization } from "@/lib/bridge";

export async function POST(req: Request) {
  try {
    if (!verifyBridgeAuthorization(req.headers.get("authorization"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const manifest = await req.json();
    if (!manifest || typeof manifest !== "object" || !manifest.tokenId || !manifest.signature) {
      return NextResponse.json({ error: "Invalid manifest" }, { status: 400 });
    }

    const result = await SwarmBridgeService.importAsset(manifest);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    return NextResponse.json({ success: true, sync_at: new Date().toISOString() });
  } catch (err) {
    console.error("[BRIDGE_FAULT] Import synchronization failure:", err);
    return NextResponse.json({ error: "Uplink synchronization failure" }, { status: 500 });
  }
}
