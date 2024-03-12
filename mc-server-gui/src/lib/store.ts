import { create } from 'zustand';

export const useStore = create((set) => ({
  logEntries: new Set<string>(),
  addLogEntry: (entry: string) => set((state: any) => ({ logEntries: new Set([...state.logEntries, entry]) })),
  clearLogEntries: () => set({ logEntries: new Set<string>() }),
}))


export const usePlayerStore = create((set) => ({
  players: new Set<string>(),
  addPlayer: (player: string) => set((state: any) => ({ players: new Set([...state.players, player]) })),
  removePlayer: (player: string) => set((state: any) => ({ players: new Set([...state.players].filter((p: string) => p !== player)) })),
}))
