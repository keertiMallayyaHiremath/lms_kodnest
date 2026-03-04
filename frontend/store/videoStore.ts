import { create } from 'zustand';

interface VideoState {
  currentPosition: number;
  isCompleted: boolean;
  setCurrentPosition: (position: number) => void;
  setCompleted: (completed: boolean) => void;
  reset: () => void;
}

export const useVideoStore = create<VideoState>((set) => ({
  currentPosition: 0,
  isCompleted: false,
  setCurrentPosition: (position) => set({ currentPosition: position }),
  setCompleted: (completed) => set({ isCompleted: completed }),
  reset: () => set({ currentPosition: 0, isCompleted: false }),
}));
