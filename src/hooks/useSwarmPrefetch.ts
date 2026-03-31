"use client";

import { useCallback } from "react";
import { useSwarmCache } from "@/lib/cache/SwarmSWR";

/**
 * useSwarmPrefetch: The Predictive Data Engine
 * Allows pre-warming the SwarmSWR cache before interaction.
 */
export function useSwarmPrefetch() {
  const { mutate, get } = useSwarmCache();

  const prefetch = useCallback(async (url: string, ttl = 60000) => {
    const cached = get(url);
    const now = Date.now();

    // Skip if valid cache exists
    if (cached && now - cached.timestamp < ttl) {
      return;
    }

    try {
      // In-flight fetch (low priority as it's predictive)
      const res = await fetch(url, { 
        priority: 'low' 
      } as RequestInit & { priority: string });

      if (!res.ok) return;
      const data = await res.json();
      
      // Materialize in global cache
      mutate(url, data);
    } catch {
      // Silently fail as pre-fetch is optional
      console.debug("[PREFETCH_SILENT_FAIL]", url);
    }
  }, [get, mutate]);

  return { prefetch };
}
