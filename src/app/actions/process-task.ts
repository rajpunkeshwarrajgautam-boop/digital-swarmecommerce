"use server";

import { auth } from "@clerk/nextjs/server";

/** Experimental task execution is retired; no simulated completion is emitted. */
export async function processAgentTask(_taskId: string): Promise<never> {
  const { userId } = await auth();
  if (!userId) throw new Error("UNAUTHORIZED");
  throw new Error("FEATURE_RETIRED");
}
