import { create } from "zustand";

import { STAGE_TO_ID_MAP } from "@lib/constants";
import {
  addTaskTimeEntry,
  findActiveTimeEntry,
  getTaskTotalHours,
  pushTaskTimeEntry,
  replaceTaskInProjects,
  replaceTaskTimeEntry,
  setTaskStatus,
} from "@lib/utils";

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
  alert: { message: string; type: any } | null;
  fetchProjects: () => Promise<void>;
  startTrackingTask: (task: ProjectTask) => void;
  stopTrackingTask: (task: ProjectTask) => Promise<ProjectTask | undefined>;
  markTaskAsDone: (task: ProjectTask) => void;
  createTimeEntry: (timeEntry: Timesheet, task: ProjectTask) => Promise<boolean>;
  updateTimeEntry: (timeEntry: Timesheet, task: ProjectTask) => void;
  deleteTimeEntry: (timeEntry: Timesheet, task: ProjectTask) => void;
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
  alert: null,
  fetchProjects: async () => {
    const response = await fetch("/api/tasks", { method: "GET" });
    if (response.ok) {
      const projects = await response.json();
      console.log("🐞 > projects:", projects);
      const activeTask = findActiveProjectTask(projects);
      set({ projects, trackedTask: activeTask });
    } else {
      const error = await response.json();
      set({ alert: { message: error.message, type: "error" } });
    }
  },
  startTrackingTask: async (task: ProjectTask) => {
    const response = await fetch(`/api/tasks/${task.id}/start`, {
      method: "POST",
      body: JSON.stringify(task),
    });
    if (response.ok) {
      const timeEntry = await response.json();
      const taskWithTimeEntries = pushTaskTimeEntry(task, timeEntry);
      const newTask = setTaskStatus(taskWithTimeEntries, "progress");
      const newProjects = replaceTaskInProjects(get().projects, newTask);
      set({ projects: newProjects, trackedTask: newTask });
    } else {
      const error = await response.json();
      set({ alert: { message: error.message, type: "error" } });
    }
  },
  stopTrackingTask: async (task: ProjectTask) => {
    const response = await fetch(`/api/tasks/${task.id}/stop`, {
      method: "POST",
      body: JSON.stringify(task),
    });
    if (response.ok) {
      const updatedTask = await response.json();
      const newProjects = replaceTaskInProjects(get().projects, updatedTask);
      set({ projects: newProjects, trackedTask: null });
      return updatedTask;
    } else {
      const error = await response.json();
      set({ alert: { message: error.message, type: "error" } });
    }
  },
  markTaskAsDone: async (task: ProjectTask) => {
    const stoppedTask = await get().stopTrackingTask(task);
    if (stoppedTask) {
      const updatedTask = setTaskStatus(stoppedTask, "done");
      const newProjects = replaceTaskInProjects(get().projects, updatedTask);
      set({ projects: newProjects });
      const totalHours = getTaskTotalHours(stoppedTask);
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        body: JSON.stringify({
          stage_id: STAGE_TO_ID_MAP["done"],
          effective_hours: totalHours,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        const newProjects = replaceTaskInProjects(get().projects, stoppedTask);
        set({ alert: { message: error.message, type: "error" }, projects: newProjects });
      }
    }
  },
  createTimeEntry: async (timeEntry: Timesheet, task: ProjectTask): Promise<boolean> => {
    const response = await fetch(`/api/time_entries`, {
      method: "POST",
      body: JSON.stringify({
        task_id: task.id,
        start: timeEntry.start,
        end: timeEntry.end,
        name: timeEntry.name,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      const newTask = addTaskTimeEntry(task, { ...timeEntry, id: data.id, unit_amount: data.unit_amount });
      const newProjects = replaceTaskInProjects(get().projects, newTask);
      set({ projects: newProjects, alert: { message: "Time Entry successfully created!", type: "success" } });
      return true;
    } else {
      const error = await response.json();
      set({ alert: { message: error.message, type: "error" } });
      return false;
    }
  },
  updateTimeEntry: async (timeEntry: Timesheet, task: ProjectTask) => {
    const response = await fetch(`/api/time_entries/${timeEntry.id}`, {
      method: "PUT",
      body: JSON.stringify({
        start: timeEntry.start,
        end: timeEntry.end,
        name: timeEntry.name,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      const newTask = replaceTaskTimeEntry(task, { ...timeEntry, unit_amount: data.unit_amount });
      const newProjects = replaceTaskInProjects(get().projects, newTask);
      set({ projects: newProjects, alert: { message: "Time Entry successfully updated!", type: "success" } });
    } else {
      const error = await response.json();
      set({ alert: { message: error.message, type: "error" } });
    }
  },
  deleteTimeEntry: async (timeEntry: Timesheet, task: ProjectTask) => {
    let newTask = replaceTaskTimeEntry(task, timeEntry, { delete: true });
    if (!newTask.timesheet_ids.length) {
      newTask = setTaskStatus(newTask, "created");
      fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        body: JSON.stringify({ stage_id: newTask.stage_id.id }),
      });
    }
    const newProjects = replaceTaskInProjects(get().projects, newTask);
    set({ projects: newProjects });
    const response = await fetch(`/api/time_entries/${timeEntry.id}`, { method: "DELETE" });
    if (response.ok) {
      set({ alert: { message: "Time Entry successfully deleted!", type: "success" } });
    } else {
      const error = await response.json();
      set({ alert: { message: error.message, type: "error" } });
    }
  },
}));

export default useProjectTaskStore;
