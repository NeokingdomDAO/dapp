import { formatInTimeZone } from "date-fns-tz";
import { EnqueueSnackbar } from "notistack";
import { v4 as uuid } from "uuid";
import { create } from "zustand";

import { ODOO_DATE_FORMAT, STAGE_TO_ID_MAP } from "@lib/constants";
import { getTaskTotalHours, replaceTaskTimeEntry } from "@lib/utils";

let showAlert: EnqueueSnackbar;

export type Project = {
  id: number;
  name: string;
  display_name: string;
  tag_ids: Array<{ id: number; name: string }>;
  tasks: ProjectTask[];
};

export type ProjectTask = {
  id: number;
  name: string;
  display_name: string;
  date_deadline: number;
  effective_hours: number;
  write_date: number;
  user_id: { id: number; name: string };
  approval_user_id: { id: number; name: string };
  tier_id: Tier;
  project_id: { id: number };
  tag_ids: Array<{ id: number; name: string }>;
  parent_id: { id: number; name: string } | null;
  stage_id: { id: number; name: string };
  child_ids: ProjectTask[];
  timesheet_ids: Timesheet[];
};

export type Tier = {
  id: number;
  name: string;
};

export type Timesheet = {
  id: number;
  name: string;
  display_name: string;
  unit_amount: number;
  start: number;
  end?: number;
};
export interface ProjectTaskStore {
  projectKey: string;
  trackedTask: ProjectTask | null;
  setActiveTask: (trackedTask: ProjectTask | null) => void;
  startTrackingTask: (task: ProjectTask) => void;
  stopTrackingTask: (task: ProjectTask) => Promise<ProjectTask | undefined>;
  markTaskAsDone: (task: ProjectTask) => void;
  createTask: (task: ProjectTask) => Promise<ProjectTask>;
  updateTask: (task: ProjectTask) => void;
  deleteTask: (task: ProjectTask) => void;
  createTimeEntry: (timeEntry: Timesheet, task: ProjectTask) => Promise<boolean>;
  updateTimeEntry: (timeEntry: Timesheet, task: ProjectTask) => void;
  deleteTimeEntry: (timeEntry: Timesheet, task: ProjectTask) => void;
}

const useProjectTaskStore = create<ProjectTaskStore>((set, get) => ({
  projectKey: uuid(),
  trackedTask: null,
  setActiveTask: (trackedTask: ProjectTask | null) => set({ trackedTask }),
  startTrackingTask: async (task: ProjectTask) => {
    const response = await fetch(`/api/tasks/${task.id}/start`, {
      method: "POST",
      body: JSON.stringify(task),
    });
    if (response.ok) {
      set({ projectKey: uuid(), trackedTask: task });
    } else {
      const error = await response.json();
      showAlert(error.message, { variant: "error" });
    }
  },
  stopTrackingTask: async (task: ProjectTask) => {
    const response = await fetch(`/api/tasks/${task.id}/stop`, {
      method: "POST",
      body: JSON.stringify(task),
    });
    if (response.ok) {
      const updatedTask = await response.json();
      set({ projectKey: uuid(), trackedTask: null });
      return updatedTask;
    } else {
      const error = await response.json();
      showAlert(error.message, { variant: "error" });
    }
  },
  markTaskAsDone: async (task: ProjectTask) => {
    const stoppedTask = await get().stopTrackingTask(task);
    if (stoppedTask) {
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
        showAlert(error.message, { variant: "error" });
      }
      set({ projectKey: uuid() });
    }
  },
  createTask: async (task: ProjectTask) => {
    const response = await fetch(`/api/tasks`, {
      method: "POST",
      body: JSON.stringify(task),
    });
    if (response.ok) {
      const newtask = await response.json();
      set({ projectKey: uuid() });
      showAlert(`Task ${newtask.name} successfully created`, { variant: "success" });
      return newtask;
    } else {
      const error = await response.json();
      showAlert(error.message, { variant: "error" });
    }
  },
  updateTask: async (task: ProjectTask) => {
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      body: JSON.stringify(task),
    });
    if (response.ok) {
      set({ projectKey: uuid() });
      showAlert(`Task ${task.name} successfully updated`, { variant: "success" });
    } else {
      const error = await response.json();
      showAlert(error.message, { variant: "error" });
    }
  },
  deleteTask: async (task: ProjectTask) => {
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      set({ projectKey: uuid() });
      showAlert(`Task ${task.name} successfully deleted`, { variant: "success" });
    } else {
      const error = await response.json();
      showAlert(error.message, { variant: "error" });
    }
  },
  createTimeEntry: async (timeEntry: Timesheet, task: ProjectTask): Promise<boolean> => {
    const response = await fetch(`/api/time_entries`, {
      method: "POST",
      body: JSON.stringify({
        task_id: task.id,
        start: formatInTimeZone(new Date(timeEntry.start), "UTC", ODOO_DATE_FORMAT),
        end: timeEntry.end && formatInTimeZone(new Date(timeEntry.end), "UTC", ODOO_DATE_FORMAT),
        name: timeEntry.name,
      }),
    });
    if (response.ok) {
      set({ projectKey: uuid() });
      showAlert("Time Entry successfully created!", { variant: "success" });
      return true;
    } else {
      const error = await response.json();
      showAlert(error.message, { variant: "error" });
      return false;
    }
  },
  updateTimeEntry: async (timeEntry: Timesheet, task: ProjectTask) => {
    const response = await fetch(`/api/time_entries/${timeEntry.id}`, {
      method: "PUT",
      body: JSON.stringify({
        start: formatInTimeZone(new Date(timeEntry.start), "UTC", ODOO_DATE_FORMAT),
        end: timeEntry.end && formatInTimeZone(new Date(timeEntry.end), "UTC", ODOO_DATE_FORMAT),
        name: timeEntry.name,
      }),
    });
    if (response.ok) {
      set({ projectKey: uuid() });
      showAlert("Time Entry successfully updated!", { variant: "success" });
    } else {
      const error = await response.json();
      showAlert(error.message, { variant: "error" });
    }
  },
  deleteTimeEntry: async (timeEntry: Timesheet, task: ProjectTask) => {
    let newTask = replaceTaskTimeEntry(task, timeEntry, { delete: true });
    if (!newTask.timesheet_ids.length) {
      fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        body: JSON.stringify({ stage_id: STAGE_TO_ID_MAP["created"] }),
      });
    }
    const response = await fetch(`/api/time_entries/${timeEntry.id}`, { method: "DELETE" });
    if (response.ok) {
      set({ projectKey: uuid() });
      showAlert("Time Entry successfully deleted!", { variant: "success" });
    } else {
      const error = await response.json();
      showAlert(error.message, { variant: "error" });
    }
  },
}));

export default function useCustomProjectTaskStore(enqueueSnackbar: EnqueueSnackbar) {
  showAlert = enqueueSnackbar;
  return useProjectTaskStore;
}
