import { create } from "zustand";

interface TimeEntry {
  startAt: Date | null;
  stopAt: Date | null;
  start: () => void;
  stop: () => void;
  reset: () => void;
  resume: () => void;
  showStopModal: boolean;
}

const useTimeEntryStore = create<TimeEntry>((set) => ({
  startAt: null,
  stopAt: null,
  start: () => set({ startAt: new Date() }),
  stop: () => set({ stopAt: new Date(), showStopModal: true }),
  reset: () => set({ startAt: null, stopAt: null, showStopModal: false }),
  resume: () => set({ stopAt: null, showStopModal: false }),
  showStopModal: false,
}));

export default useTimeEntryStore;
