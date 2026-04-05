"use client";

import { useEffect } from 'react';
import { useSwarmSWR } from '@/hooks/useSwarmSWR';
import { NeuralSyntheticsService } from '@/lib/synthetics';

export function SwarmHueSync() {
  const { data } = useSwarmSWR<any>('/api/dao/pulse');

  useEffect(() => {
    if (data?.pulse?.treasury_velocity !== undefined) {
      const newHue = NeuralSyntheticsService.getGlobalHueShift(data.pulse.treasury_velocity);
      document.documentElement.style.setProperty('--primary-hue', newHue.toString());
      
      // Also update dependent HSL colors if needed
      document.documentElement.style.setProperty('--primary', `hsl(${newHue}, 70%, 45%)`);
      console.log(`[SWARM] Neural Sync: Hue shifted to ${newHue}`);
    }
  }, [data]);

  return null; // Side-effect only component
}
