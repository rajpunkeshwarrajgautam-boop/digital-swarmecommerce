/**
 * ARCHITECTURAL_UPLINK: Swarm Intelligence Engine
 * Connects agent goals to the Gemini 1.5 Pro reasoning core.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";

export interface TaskStep {
  id: number;
  description: string;
  tool?: string;
  status: 'pending' | 'executing' | 'done';
}

/**
 * PROTOCOL_DECOMPOSITION: Breaks down a high-level goal into executable steps.
 */
export async function decomposeGoal(goal: string, agentType: string): Promise<TaskStep[]> {
  if (!GEMINI_API_KEY) {
    console.warn("[SWARM_BRAIN_OFFLINE]: No API key detected. Using fallback decomposition.");
    return [
      { id: 1, description: "INITIALIZE_CORE_PROTOCOL", status: 'done' },
      { id: 2, description: `ANALYZE_GOAL: ${goal.slice(0, 20)}...`, status: 'pending' },
      { id: 3, description: "EXECUTE_SWARM_HEURISTICS", status: 'pending' }
    ];
  }

  try {
    const prompt = `
      You are the reasoning core for a Digital Swarm Agent (${agentType}).
      User Goal: "${goal}"
      
      TASK: Decompose this goal into 3-5 discrete, industrial-grade execution steps.
      FORMAT: Return ONLY a JSON array of objects with "id" (number) and "description" (string).
      STYLE: Brutalist, technical, concise.
    `;

    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    
    // Extract JSON from the markdown-wrapped response if necessary
    const jsonMatch = textResult.match(/\[[\s\S]*\]/);
    const steps = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    return steps.map((s: any) => ({ ...s, status: 'pending' }));
  } catch (err) {
    console.error("[DECOMPOSITION_FAILURE]:", err);
    return [{ id: 1, description: "FALLBACK_RECOVERY_ENGAGED", status: 'pending' }];
  }
}
