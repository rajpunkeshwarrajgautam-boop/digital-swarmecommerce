import { NextResponse } from "next/server";

/**
 * Retired legacy seeder.
 *
 * This route embedded an old four-product catalog with stale claims and could
 * overwrite the production commerce model if an administrator invoked it.
 * The maintained catalog synchronization workflow is `/api/products/sync`.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: "Legacy catalog seeder retired",
      replacement: "/api/products/sync",
    },
    { status: 410 },
  );
}
