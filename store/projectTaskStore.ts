import { create } from "zustand";

export type Project = {
  id: number;
  name: string;
  display_name: string;
  tasks: ProjectTask[];
};

export type ProjectTask = {
  id: number;
  name: string;
  display_name: string;
  parent_id: { id: number; name: string } | null;
  stage_id: { id: number; name: string };
  child_ids: ProjectTask[];
  timesheet_ids: Timesheet[];
};

export type Timesheet = {
  id: number;
  name: string;
  display_name: string;
  unit_amount: number;
  start: string;
  end?: string;
};

export interface ProjectTaskStore {
  projects: Project[];
  trackedTask: ProjectTask | null;
  fetchProjects: () => Promise<void>;
  startTrackingTask: (task: ProjectTask) => void;
  stopTrackingTask: (task: ProjectTask) => void;
}

const useProjectTaskStore = create<ProjectTaskStore>((set) => ({
  projects: [],
  trackedTask: null,
  fetchProjects: async () => {
    const response = await fetch("/api/tasks", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const projects = await response.json();
    console.log("🐞 > projects:", projects);
    set({ projects });
  },
  startTrackingTask: (task: ProjectTask) => set({ trackedTask: task }),
  stopTrackingTask: (task: ProjectTask) => set({ trackedTask: null }),
}));

export default useProjectTaskStore;
