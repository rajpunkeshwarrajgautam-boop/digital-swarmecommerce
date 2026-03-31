"use client";

import React, { createContext, useContext, useRef, useCallback } from "react";

/**
 * SwarmSWR: High-Performance Data Synchronization Protocol
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

interface SwarmCacheContextType {
  get: (key: string) => CacheItem<any> | undefined;
  mutate: (key: string, data: any) => void;
}

const SwarmCacheContext = createContext<SwarmCacheContextType | undefined>(undefined);

export function SwarmSWRProvider({ children }: { children: React.ReactNode }) {
  const cache = useRef<Map<string, CacheItem<any>>>(new Map());

  const get = useCallback((key: string) => {
    return cache.current.get(key);
  }, []);

  const mutate = useCallback((key: string, data: any) => {
    cache.current.set(key, {
      data,
      timestamp: Date.now(),
    });
  }, []);

  return (
    <SwarmCacheContext.Provider value={{ get, mutate }}>
      {children}
    </SwarmCacheContext.Provider>
  );
}

export function useSwarmCache() {
  const context = useContext(SwarmCacheContext);
  if (!context) {
    throw new Error("useSwarmCache must be used within a SwarmSWRProvider");
  }
  return context;
}
