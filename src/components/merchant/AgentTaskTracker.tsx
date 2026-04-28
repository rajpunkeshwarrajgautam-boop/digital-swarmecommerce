"use client";

import { useEffect, useState } from "react";
import { getOwnerTasks, AgentTask } from "@/app/actions/tasks";
import { GlassCard } from "@/components/ui/GlassCard";
import { BrainCircuit, Loader2, CheckCircle2, XCircle, Clock, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AgentTaskTracker() {
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const data = await getOwnerTasks();
        setTasks(data);
      } catch (error) {
        console.error("FAILED_TO_FETCH_TASKS:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
    const interval = setInterval(fetchTasks, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center gap-4 text-white/20">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Scanning_Active_Directives...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h3 className="font-black uppercase tracking-widest text-sm text-white/40 italic">{"/// ACTIVE_AGENT_DIRECTIVES ///"}</h3>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black text-primary uppercase tracking-tighter italic">Live_Uplink</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tasks.length === 0 ? (
          <GlassCard className="p-12 text-center border-dashed border-white/10">
            <p className="text-white/40 font-inter text-sm italic">
              No active swarm directives. Deploy an agent to start protocol execution.
            </p>
          </GlassCard>
        ) : (
          tasks.map((task) => <TaskItem key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}

function TaskItem({ task }: { task: AgentTask }) {
  const statusConfig = {
    queued: { icon: Clock, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
    processing: { icon: Zap, color: "text-[#CCFF00]", bg: "bg-[#CCFF00]/10", border: "border-[#CCFF00]/20" },
    completed: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
    failed: { icon: XCircle, color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20" },
  };

  const config = statusConfig[task.status];
  const Icon = config.icon;

  return (
    <GlassCard className={`p-6 border-2 transition-all hover:border-white/20 group relative overflow-hidden ${config.border}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-none border ${config.bg} ${config.border}`}>
            <Icon className={`w-5 h-5 ${config.color} ${task.status === 'processing' ? 'animate-pulse' : ''}`} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Task_#{task.id.slice(0, 8)}</span>
              <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded ${config.bg} ${config.color}`}>
                {task.status}
              </span>
            </div>
            <h4 className="text-lg font-black italic uppercase text-white tracking-tight">{task.goal}</h4>
          </div>
        </div>

        <div className="flex items-center gap-6 text-right">
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Protocol</span>
            <span className="text-[10px] font-mono text-white uppercase">{task.agent_id}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Deployed</span>
            <span className="text-[10px] font-mono text-white">{new Date(task.created_at).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Progress bar for processing tasks */}
      {task.status === 'processing' && (
        <div className="mt-6 h-1 bg-white/5 overflow-hidden">
          <motion.div 
            className="h-full bg-primary shadow-[0_0_10px_#CCFF00]"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}
      
      {/* Result preview if completed */}
      {task.status === 'completed' && task.result && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-[10px] font-mono text-emerald-400/60 italic line-clamp-1">
            RESULT: {task.result}
          </p>
        </div>
      )}
    </GlassCard>
  );
}
