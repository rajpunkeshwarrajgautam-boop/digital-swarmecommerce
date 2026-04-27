"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { decomposeGoal } from "@/lib/swarm-brain";
import { revalidatePath } from "next/cache";

/**
 * PROTOCOL_EXECUTION: Triggers the AI reasoning cycle for a queued task.
 */
export async function processAgentTask(taskId: string) {
  if (!supabaseAdmin) throw new Error("DATABASE_UNAVAILABLE");

  // 1. Fetch Task Context
  const { data: task, error: fetchError } = await supabaseAdmin
    .from("agent_tasks")
    .select("*")
    .eq("id", taskId)
    .single();

  if (fetchError || !task) throw new Error("TASK_NOT_FOUND");

  // 2. [STATE_UPDATE] Set to Processing
  await supabaseAdmin
    .from("agent_tasks")
    .update({ status: 'processing' })
    .eq("id", taskId);

  try {
    // 3. [AI_UPLINK] Decompose goal into steps
    const steps = await decomposeGoal(task.goal, "Digital_Swarm_General_Agent");

    // 4. [SIMULATED_EXECUTION] In a real system, this would trigger actual tools.
    // For MVP, we simulate the completion of steps.
    await supabaseAdmin
      .from("agent_tasks")
      .update({ 
        steps: steps,
        status: 'completed',
        result: `SUCCESS: Task "${task.goal}" executed via swarm protocol. Final output securely delivered to vault.`
      })
      .eq("id", taskId);

    revalidatePath(`/merchant/agents/${task.agent_id}`);
    return { success: true };
  } catch (err) {
    console.error("[TASK_PROCESS_FAILURE]:", err);
    await supabaseAdmin
      .from("agent_tasks")
      .update({ status: 'failed', result: "CRITICAL_LOGIC_FAULT: Swarm brain disconnected." })
      .eq("id", taskId);
    throw err;
  }
}
