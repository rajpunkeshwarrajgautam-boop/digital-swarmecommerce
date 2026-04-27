"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export interface AgentTask {
  id: string;
  agent_id: string;
  owner_id: string;
  goal: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  steps: any[];
  result?: string;
  created_at: string;
}

/**
 * PROTOCOL_COMMAND: Assigns a dynamic goal to an agent.
 */
export async function assignTaskToAgent(agentId: string, goal: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("UNAUTHORIZED");

  if (!supabaseAdmin) throw new Error("DATABASE_UNAVAILABLE");

  const { data, error } = await supabaseAdmin
    .from("agent_tasks")
    .insert({
      agent_id: agentId,
      owner_id: userId,
      goal: goal,
      status: 'queued',
      steps: []
    })
    .select()
    .single();

  if (error) {
    console.error("[TASK_ASSIGN_ERROR]:", error);
    throw error;
  }

  revalidatePath(`/merchant/agents/${agentId}`);
  return data as AgentTask;
}

/**
 * PROTOCOL_TRACKING: Retrieves all active tasks for the current node owner.
 */
export async function getOwnerTasks() {
  const { userId } = await auth();
  if (!userId) throw new Error("UNAUTHORIZED");

  if (!supabaseAdmin) throw new Error("DATABASE_UNAVAILABLE");

  const { data, error } = await supabaseAdmin
    .from("agent_tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[TASK_FETCH_ERROR]:", error);
    throw error;
  }

  return data as AgentTask[];
}
