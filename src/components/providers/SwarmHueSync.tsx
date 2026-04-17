"use client";

import { useEffect } from 'react';
import { useSwarmSWR } from '@/hooks/useSwarmSWR';
import { NeuralSyntheticsService } from '@/lib/synthetics';

const pulseSwrOpts = {
  /** Decorative theme sync — no need to hammer the API on tab focus. */
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 120_000,
  refreshInterval: 120_000,
} as const;

export function SwarmHueSync() {
  const { data } = useSwarmSWR<any>('/api/dao/pulse', pulseSwrOpts);

  useEffect(() => {
    if (data?.pulse?.treasury_velocity !== undefined) {
      const newHue = NeuralSyntheticsService.getGlobalHueShift(data.pulse.treasury_velocity);
      document.documentElement.style.setProperty('--primary-hue', newHue.toString());
      document.documentElement.style.setProperty('--primary', `hsl(${newHue}, 70%, 45%)`);
    }
  }, [data]);

  return null; // Side-effect only component
}
