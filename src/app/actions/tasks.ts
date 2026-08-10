"use server";

import { auth } from "@clerk/nextjs/server";

export interface AgentTask {
  id: string;
  agent_id: string;
  owner_id: string;
  goal: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  steps: unknown[];
  result?: string;
  created_at: string;
}

/** The experimental task runner is retired and no longer accepts writes. */
export async function assignTaskToAgent(_agentId: string, _goal: string): Promise<never> {
  const { userId } = await auth();
  if (!userId) throw new Error("UNAUTHORIZED");
  throw new Error("FEATURE_RETIRED");
}

/** Do not expose legacy task rows now that the experiment is retired. */
export async function getOwnerTasks(): Promise<AgentTask[]> {
  const { userId } = await auth();
  if (!userId) throw new Error("UNAUTHORIZED");
  return [];
}
