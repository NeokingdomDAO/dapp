import { formatInTimeZone } from "date-fns-tz";
import { v4 as uuid } from "uuid";
import { create } from "zustand";

import { ODOO_DATE_FORMAT, STAGE_TO_ID_MAP } from "@lib/constants";
import { getTaskTotalHours } from "@lib/utils";

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

export type ActionResponse = {
  data?: any;
  error?: any;
  alert?: { message: string; variant: any };
};
export interface ProjectTaskStore {
  projectKey: string;
  trackedTask: ProjectTask | null;
  actions: {
    setActiveTask: (trackedTask: ProjectTask | null) => void;
    startTrackingTask: (task: ProjectTask) => Promise<ActionResponse | undefined>;
    stopTrackingTask: (task: ProjectTask) => Promise<ActionResponse>;
    markTaskAsDone: (task: ProjectTask) => Promise<ActionResponse | undefined>;
    createTask: (task: ProjectTask) => Promise<ActionResponse>;
    updateTask: (task: ProjectTask) => Promise<ActionResponse>;
    deleteTask: (task: ProjectTask) => Promise<ActionResponse>;
    createTimeEntry: (timeEntry: Timesheet, task: ProjectTask) => Promise<ActionResponse>;
    updateTimeEntry: (timeEntry: Timesheet, task: ProjectTask) => Promise<ActionResponse>;
    deleteTimeEntry: (timeEntry: Timesheet, task: ProjectTask) => Promise<ActionResponse>;
  };
}

const buildError = async (response: Response) => ({ ...(await response.json()), status: response.status });

const useProjectTaskStore = create<ProjectTaskStore>((set, get) => ({
  projectKey: uuid(),
  trackedTask: null,
  actions: {
    setActiveTask: (trackedTask: ProjectTask | null) => set({ trackedTask }),
    startTrackingTask: async (task: ProjectTask) => {
      const response = await fetch(`/api/tasks/${task.id}/start`, {
        method: "POST",
        body: JSON.stringify(task),
      });
      if (response.ok) {
        set({ projectKey: uuid(), trackedTask: task });
      } else {
        const error = await buildError(response);
        return { error };
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
        return { data: updatedTask };
      } else {
        return { error: await buildError(response) };
      }
    },
    markTaskAsDone: async (task: ProjectTask) => {
      const { data: stoppedTask } = await get().actions.stopTrackingTask(task);
      if (stoppedTask) {
        const totalHours = getTaskTotalHours(stoppedTask);
        const response = await fetch(`/api/tasks/${task.id}`, {
          method: "PUT",
          body: JSON.stringify({
            stage_id: STAGE_TO_ID_MAP["done"],
            effective_hours: totalHours,
          }),
        });
        if (response.ok) {
          set({ projectKey: uuid() });
          return { alert: { message: "Task completed!", variant: "success" } };
        } else {
          return { error: await buildError(response) };
        }
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
        return { data: newtask, alert: { message: `Task ${newtask.name} successfully created`, variant: "success" } };
      } else {
        return { error: await buildError(response) };
      }
    },
    updateTask: async (task: ProjectTask) => {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        body: JSON.stringify(task),
      });
      if (response.ok) {
        set({ projectKey: uuid() });
        return { alert: { message: `Task ${task.name} successfully updated`, variant: "success" } };
      } else {
        return { error: await buildError(response) };
      }
    },
    deleteTask: async (task: ProjectTask) => {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        set({ projectKey: uuid() });
        return { alert: { message: `Task ${task.name} successfully deleted`, variant: "success" } };
      } else {
        return { error: await buildError(response) };
      }
    },
    createTimeEntry: async (timeEntry: Timesheet, task: ProjectTask) => {
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
        return { alert: { message: "Time Entry successfully created!", variant: "success" } };
      } else {
        return { error: await buildError(response) };
      }
    },
    updateTimeEntry: async (timeEntry: Timesheet) => {
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
        return { alert: { message: "Time Entry successfully updated!", variant: "success" } };
      } else {
        return { error: await buildError(response) };
      }
    },
    deleteTimeEntry: async (timeEntry: Timesheet, task: ProjectTask) => {
      if (task.timesheet_ids.length === 1) {
        fetch(`/api/tasks/${task.id}`, {
          method: "PUT",
          body: JSON.stringify({ stage_id: STAGE_TO_ID_MAP["created"] }),
        });
      }
      const response = await fetch(`/api/time_entries/${timeEntry.id}`, { method: "DELETE" });
      if (response.ok) {
        set({ projectKey: uuid() });
        return { alert: { message: "Time Entry successfully deleted!", variant: "success" } };
      } else {
        return { error: await buildError(response) };
      }
    },
  },
}));

export default useProjectTaskStore;

export const useProjectTaskActions = () => useProjectTaskStore((state) => state.actions);
