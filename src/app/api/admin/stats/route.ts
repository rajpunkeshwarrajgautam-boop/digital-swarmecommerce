import { NextResponse } from "next/server";
import { getAdminStats } from "@/app/actions/admin";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  
  // Security Layer (Optional: Add more robust role check here)
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const stats = await getAdminStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("[ADMIN_STATS_ERR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
