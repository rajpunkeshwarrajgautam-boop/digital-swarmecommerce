"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw, Terminal } from "lucide-react";
import { ForgeButton } from "./ForgeButton";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  errorDetail?: string;
}

export class ForgeErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorDetail: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[FORGE_EXCEPTION_UNHANDLED]", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.fallback) return this.fallback;

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8 bg-black/40 border border-primary/20 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-pulse" />
          
          <div className="max-w-md space-y-8 text-center relative z-10">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-primary/10 border border-primary/30 flex items-center justify-center rounded-2xl">
                <AlertTriangle className="w-10 h-10 text-primary" />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-outfit font-black italic uppercase tracking-tighter text-white">
                Core_Logic_Fault
              </h2>
              <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-white/30 uppercase tracking-[0.4em]">
                <Terminal className="w-3 h-3" /> Exception_ID: {this.state.errorDetail || "UNKN_FLT"}
              </div>
              <p className="text-white/40 text-sm font-mono leading-relaxed">
                A critical exception has decoupled the UI stream from the logic core. Materialization aborted.
              </p>
            </div>

            <div className="pt-8">
              <ForgeButton 
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center gap-3"
              >
                <RefreshCcw className="w-4 h-4" /> Reinitialize_Stream
              </ForgeButton>
            </div>
          </div>
          
          {/* Glitch Overlay */}
          <div className="absolute inset-0 bg-primary/5 pointer-events-none mix-blend-overlay opacity-20" />
        </div>
      );
    }

    return this.props.children;
  }

  private get fallback() {
    return this.props.fallback;
  }
}
