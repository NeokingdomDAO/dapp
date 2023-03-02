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
  effective_hours: number;
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

const findActiveTask = (projects: Project[]) => {
  let activeTask = null;
  projects.find((project) => {
    return project.tasks.find((task) => {
      const timeEntry = task.timesheet_ids.find((ts) => !ts.end);
      const childTimeEntry = task.timesheet_ids.find((ts) => !ts.end);
      if (timeEntry || childTimeEntry) {
        activeTask = task;
        return true;
      }
    });
  });
  return activeTask;
};

const useProjectTaskStore = create<ProjectTaskStore>((set) => ({
  projects: [],
  trackedTask: null,
  fetchProjects: async () => {
    const response = await fetch("/api/tasks", { method: "GET" });
    if (response.ok) {
      const projects = await response.json();
      console.log("🐞 > projects:", projects);
      const activeTask = findActiveTask(projects);
      set({ projects, trackedTask: activeTask });
    }
  },
  startTrackingTask: async (task: ProjectTask) => {
    const response = await fetch(`/api/tasks/${task.id}/time_entry`, {
      method: "POST",
      body: JSON.stringify(task),
    });
    console.log("🐞 > response:", response);
    if (response.ok) {
      const timeEntry = await response.json();
      console.log("🐞 > timeEntry:", timeEntry);
      set({ trackedTask: task });
    }
  },
  stopTrackingTask: (task: ProjectTask) => set({ trackedTask: null }),
}));

export default useProjectTaskStore;
