import { create } from "zustand";

import { findActiveTimeEntry, pushTaskTimeEntry, replaceTaskInProjects, replaceTaskTimeEntry } from "@lib/utils";

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
  project_id: { id: number };
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

const findActiveProjectTask = (projects: Project[]) => {
  let activeProjectTask = null;
  projects.find((project) => {
    return project.tasks.find((task) => {
      const [activeTimeEntry, activeTask] = findActiveTimeEntry(task);
      if (activeTimeEntry) {
        activeProjectTask = activeTask;
        return true;
      }
    });
  });
  return activeProjectTask;
};

const useProjectTaskStore = create<ProjectTaskStore>((set, get) => ({
  projects: [],
  trackedTask: null,
  fetchProjects: async () => {
    const response = await fetch("/api/tasks", { method: "GET" });
    if (response.ok) {
      const projects = await response.json();
      console.log("🐞 > projects:", projects);
      const activeTask = findActiveProjectTask(projects);
      set({ projects, trackedTask: activeTask });
    }
  },
  startTrackingTask: async (task: ProjectTask) => {
    const response = await fetch(`/api/tasks/${task.id}/time_entries`, {
      method: "POST",
      body: JSON.stringify(task),
    });
    if (response.ok) {
      const timeEntry = await response.json();
      const newTask = pushTaskTimeEntry(task, timeEntry);
      const newProjects = replaceTaskInProjects(get().projects, newTask);
      set({ projects: newProjects, trackedTask: newTask });
    }
  },
  stopTrackingTask: async (task: ProjectTask) => {
    const response = await fetch(`/api/tasks/${task.id}/time_entries`, {
      method: "PUT",
      body: JSON.stringify(task),
    });
    if (response.ok) {
      const updatedTask = await response.json();
      const newProjects = replaceTaskInProjects(get().projects, updatedTask);
      set({ projects: newProjects, trackedTask: null });
    }
  },
  deleteTimeEntry: async (timeEntry: Timesheet, task: ProjectTask) => {
    const newTask = replaceTaskTimeEntry(task, timeEntry, { delete: true });
    const newProjects = replaceTaskInProjects(get().projects, newTask);
    set({ projects: newProjects, trackedTask: null });
    await fetch(`/api/tasks/${task.id}/time_entries/${timeEntry.id}`, { method: "DELETE" });
  },
}));

export default useProjectTaskStore;
