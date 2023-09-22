import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserSettingsStore {
  openProjects: number[];
  openTasks: number[];
  setOpenTasks: (openTasks: number[]) => void;
  setOpenProjects: (openProjects: number[]) => void;
}

const userUserSettingsStore = create(
  persist<UserSettingsStore>(
    (set) => ({
      openProjects: [],
      openTasks: [],
      setOpenTasks: (openTasks: number[]) => set({ openTasks }),
      setOpenProjects: (openProjects: number[]) => set({ openProjects }),
    }),
    {
      name: "user-settings-storage",
    },
  ),
);

export default userUserSettingsStore;
