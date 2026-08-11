"use client";

import { Zap } from "lucide-react";

interface ScarcityEngineProps {
  stockCount?: number;
  expiresInHours?: number;
}

export function ScarcityEngine({ stockCount: _stockCount, expiresInHours: _expiresInHours }: ScarcityEngineProps) {
  return (
    <div className="mb-6 flex items-center gap-2 pt-1 text-xs text-muted-foreground">
      <Zap className="w-3 h-3 text-primary" />
      <span>Digital delivery is issued after verified payment; no artificial stock or countdown claims are shown.</span>
    </div>
  );
}
