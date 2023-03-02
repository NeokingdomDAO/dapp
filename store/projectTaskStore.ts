import { add } from "date-fns";
import produce from "immer";
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

const addFakeTimesToProjects = (projects: Project[]): Project[] => {
  const now = new Date();
  const start = now.toISOString();
  const end = add(now, { minutes: 5 }).toISOString();
  return produce(projects, (draftProjects) => {
    draftProjects.forEach((project) => {
      project.tasks.forEach((task) => {
        task.timesheet_ids.forEach((timesheet) => {
          timesheet.start = start;
          timesheet.end = end;
        });
        task.child_ids.forEach((child) => {
          child.timesheet_ids.forEach((timesheet) => {
            timesheet.start = start;
            timesheet.end = end;
          });
        });
      });
    });
  });
};

const useProjectTaskStore = create<ProjectTaskStore>((set) => ({
  projects: [],
  trackedTask: null,
  fetchProjects: async () => {
    const response = await fetch("/api/tasks", { method: "GET" });
    if (response.ok) {
      const projects = await response.json();
      const fakeProjects = addFakeTimesToProjects(projects);
      console.log("🐞 > projects:", fakeProjects);
      set({ projects: fakeProjects });
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
