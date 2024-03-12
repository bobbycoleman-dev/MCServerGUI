import { create } from 'zustand';

export const useStore = create((set) => ({
  logEntries: new Set<string>(),
  addLogEntry: (entry: string) => set((state: any) => ({ logEntries: new Set([...state.logEntries, entry]) })),
  clearLogEntries: () => set({ logEntries: new Set<string>() }),
}))
