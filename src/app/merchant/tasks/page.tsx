"use client";

import { useEffect, useState } from "react";
import { Header } from "@/layout/Header";
import { Footer } from "@/layout/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Terminal, Send, Cpu, Layers, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { getOwnerTasks, assignTaskToAgent, AgentTask } from "@/app/actions/tasks";
import { processAgentTask } from "@/app/actions/process-task";
import { motion, AnimatePresence } from "framer-motion";

export default function AgentCommandCenter() {
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [goal, setGoal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadTasks() {
    try {
      const data = await getOwnerTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setIsSubmitting(true);
    try {
      const newTask = await assignTaskToAgent("GENERAL_AGENT_001", goal);
      setGoal("");
      // Trigger immediate processing for the demo
      await processAgentTask(newTask.id);
      await loadTasks();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Command Input */}
          <div className="lg:col-span-1 space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white leading-none">Command Node</h1>
              <p className="text-gray-500 text-[11px] font-black uppercase tracking-widest">Assign dynamic goals to your swarm agents.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#CCFF00] to-cyan-500 rounded-none blur opacity-10 group-focus-within:opacity-30 transition duration-1000"></div>
                <div className="relative bg-black border-4 border-white/10 p-4 space-y-4">
                  <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-gray-600">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3 h-3" />
                      <span>UPLINK_TERMINAL_V1.2</span>
                    </div>
                    <span className="text-[#CCFF00]">READY</span>
                  </div>
                  <textarea 
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="ENTER_GOAL_PROMPT..."
                    className="w-full h-40 bg-transparent text-white font-mono text-xs outline-none resize-none placeholder:text-gray-800"
                  />
                  <button 
                    disabled={isSubmitting || !goal.trim()}
                    className="w-full bg-[#CCFF00] text-black p-4 font-black uppercase tracking-widest italic text-xs hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {isSubmitting ? "TRANSMITTING..." : "EXECUTE_PROTOCOL"}
                  </button>
                </div>
              </div>

              <div className="p-4 border border-white/5 bg-white/5 space-y-2">
                <div className="text-[9px] font-black uppercase tracking-widest text-gray-500 italic">Example_Commands:</div>
                <div className="text-[10px] font-mono text-gray-600 hover:text-white cursor-pointer transition-colors" onClick={() => setGoal("Analyze competitor pricing for agentic frameworks.")}>- Analyze competitor pricing.</div>
                <div className="text-[10px] font-mono text-gray-600 hover:text-white cursor-pointer transition-colors" onClick={() => setGoal("Verify current smart contract audit status.")}>- Verify contract audit status.</div>
              </div>
            </form>
          </div>

          {/* Right Column: Task Feed */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black italic uppercase tracking-tight text-white">Execution Feed</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Node_Active</span>
              </div>
            </div>

            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {tasks.length === 0 ? (
                  <div className="py-20 text-center border-4 border-dashed border-white/5 text-gray-800 font-black italic uppercase text-xl">
                    NO_ACTIVE_TRANSMISSIONS
                  </div>
                ) : (
                  tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

function TaskCard({ task }: { task: AgentTask }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <GlassCard className="p-8 border-4 border-white/10 rounded-none bg-black/60 space-y-6 relative overflow-hidden group">
        
        {/* Status Line */}
        <div className={`absolute top-0 left-0 w-1 h-full ${
          task.status === 'completed' ? 'bg-[#CCFF00]' : 
          task.status === 'processing' ? 'bg-cyan-500' : 
          task.status === 'failed' ? 'bg-red-500' : 'bg-gray-700'
        }`} />

        <div className="flex items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-black uppercase tracking-widest ${
                task.status === 'completed' ? 'text-[#CCFF00]' : 'text-gray-500'
              }`}>
                TASK_ID: {task.id.slice(0, 8)}
              </span>
              <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">{new Date(task.created_at).toLocaleString()}</span>
            </div>
            <h3 className="text-xl font-black italic uppercase text-white tracking-tight leading-snug">
              {task.goal}
            </h3>
          </div>
          
          <div className={`px-4 py-1 border text-[9px] font-black uppercase tracking-widest ${
            task.status === 'completed' ? 'border-[#CCFF00] text-[#CCFF00]' :
            task.status === 'processing' ? 'border-cyan-500 text-cyan-500' :
            'border-gray-800 text-gray-600'
          }`}>
            {task.status}
          </div>
        </div>

        {/* Execution Steps */}
        {task.steps && task.steps.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-white/5">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-600">
              <Layers className="w-3 h-3" />
              <span>AI_REASONING_CHAIN</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {task.steps.map((step: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 group-hover:border-white/10 transition-all">
                  <div className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center">
                    <div className="w-1 h-1 bg-[#CCFF00]" />
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 uppercase leading-none">{step.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Result Area */}
        {task.result && (
          <div className="bg-[#CCFF00]/5 border border-[#CCFF00]/20 p-4 space-y-2">
            <div className="text-[9px] font-black uppercase tracking-widest text-[#CCFF00]">/// PROTOCOL_RESULT_UPLINK ///</div>
            <p className="text-[11px] font-inter text-[#CCFF00]/90 leading-relaxed italic">
              {task.result}
            </p>
          </div>
        )}

      </GlassCard>
    </motion.div>
  );
}
