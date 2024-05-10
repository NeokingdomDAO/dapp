import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TimeEntry {
  startAt: number | null;
  stopAt: number | null;
  taskId: number | null;
  description: string;
  tier_id: { id: number } | null;
  start: () => void;
  stop: () => void;
  reset: () => void;
  resume: () => void;
  setTaskId: (taskId: number | null) => void;
  setStartAt: (startAt: number) => void;
  addNew: (props: Partial<TimeEntry>) => void;
  showStopModal: boolean;
  setDescription: (description: string) => void;
}

const useTimeEntryStore = create(
  persist<TimeEntry>(
    (set) => ({
      startAt: null,
      stopAt: null,
      taskId: null,
      description: "",
      tier_id: null,
      showStopModal: false,
      start: () => set({ startAt: +new Date() }),
      setStartAt: (startAt: number) => set({ startAt }),
      stop: () => set({ stopAt: +new Date(), showStopModal: true }),
      reset: () => set({ startAt: null, stopAt: null, showStopModal: false, description: "" }),
      resume: () => set({ stopAt: null, showStopModal: false }),
      setTaskId: (taskId: number | null) => set({ taskId }),
      addNew: (props: Partial<TimeEntry>) => set(props),
      setDescription: (description: string) => set({ description }),
    }),
    {
      name: "time-entry-storage",
    },
  ),
);

export default useTimeEntryStore;
