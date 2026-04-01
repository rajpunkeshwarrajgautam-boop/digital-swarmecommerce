"use client";

import { useState, useEffect, useCallback } from "react";
import { useSwarmCache } from "@/lib/cache/SwarmSWR";

interface SwarmSWRResponse<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  mutate: (newData: T) => void;
  revalidate: () => Promise<void>;
}

/**
 * useSwarmSWR: High-Velocity Data Sync Protocol
 * @param url The endpoint to fetch from
 * @param options { dedupingInterval: ms }
 */
export function useSwarmSWR<T = unknown>(
  url: string | null,
  options = { dedupingInterval: 60000 }
): SwarmSWRResponse<T> {
  const { get, mutate: updateCache } = useSwarmCache();
  const [data, setData] = useState<T | null>(() => {
    if (!url) return null;
    return get(url)?.data || null;
  });
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(!data);

  const revalidate = useCallback(async (retryCount = 0) => {
    if (!url) return;

    const cached = get(url);
    const now = Date.now();

    // Skip if within deduping interval
    if (cached && now - cached.timestamp < options.dedupingInterval) {
      if (!data) setData(cached.data);
      setIsLoading(false);
      return;
    }

    try {
      if (!data && !cached) setIsLoading(true);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Swarm fetch failed: ${res.status}`);
      const newData = await res.json();

      updateCache(url, newData);
      setData(newData);
      setError(null);
    } catch (err) {
      // Exponential Backoff Retry (Max 3 attempts)
      if (retryCount < 3 && url) {
        setTimeout(() => revalidate(retryCount + 1), 2000 * Math.pow(2, retryCount));
      }
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [url, get, updateCache, data, options.dedupingInterval]);

  useEffect(() => {
    revalidate();

    // Swarm Protocol: Real-time Revalidation Triggers
    const handleFocus = () => revalidate();
    const handleReconnect = () => revalidate();

    window.addEventListener("focus", handleFocus);
    window.addEventListener("online", handleReconnect);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("online", handleReconnect);
    };
  }, [url, revalidate]);

  const mutate = useCallback((newData: T) => {
    if (!url) return;
    updateCache(url, newData);
    setData(newData);
  }, [url, updateCache]);

  return { data, error, isLoading, mutate, revalidate };
}
