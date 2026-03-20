import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface MemoryLog {
  id: string;
  timestamp: string;
  type: 'interaction' | 'preference' | 'system' | 'ai';
  content: string;
  metadata?: Record<string, any>;
}

interface MemoryState {
  logs: MemoryLog[];
  userPreferences: Record<string, any>;
  lastSession: string;
  isSyncing: boolean;
  
  // Actions
  addLog: (content: string, type?: MemoryLog['type'], metadata?: Record<string, any>) => void;
  updatePreference: (key: string, value: any) => void;
  clearMemory: () => void;
  setSyncing: (status: boolean) => void;
}

export const useMemoryStore = create<MemoryState>()(
  persist(
    (set, get) => ({
      logs: [],
      userPreferences: {
        theme: 'planet-ono-brutalist',
        aiLevel: 'aggressive',
        autoSync: true
      },
      lastSession: new Date().toISOString(),
      isSyncing: false,

      addLog: (content, type = 'interaction', metadata = {}) => {
        const newLog: MemoryLog = {
          id: Math.random().toString(36).substring(7),
          timestamp: new Date().toISOString(),
          type,
          content,
          metadata
        };
        
        // Keep only last 100 logs to maintain performance
        const currentLogs = [newLog, ...get().logs].slice(0, 100);
        set({ logs: currentLogs, lastSession: new Date().toISOString() });
      },

      updatePreference: (key, value) => {
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            [key]: value
          }
        }));
      },

      clearMemory: () => set({ logs: [], userPreferences: {} }),
      setSyncing: (status) => set({ isSyncing: status })
    }),
    {
      name: 'digitalswarm-synaptic-memory',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
