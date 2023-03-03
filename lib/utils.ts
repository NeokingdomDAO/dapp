import { format, isSameDay } from "date-fns";
import produce from "immer";

import { Project, ProjectTask, Timesheet } from "@store/projectTaskStore";

import { META } from "../pages/_document";

export const getLettersFromName = (name: string) =>
  name
    ?.split(/\s/)
    .map((w) => Array.from(w)[0])
    .slice(0, 2)
    .join("");

export const enhanceTitleWithPrefix = (title: string, reversed?: boolean) =>
  reversed ? `${title} | ${META.title}` : `${META.title} | ${title}`;

export const isSameAddress = (addressLeft: string, addressRight: string) =>
  typeof addressLeft === "string" && // neeeded as odoo sometimes returns false as eth address
  typeof addressRight === "string" && // see ^
  addressLeft.toLowerCase() === addressRight.toLowerCase();

export function toPrettyDuration(time: number) {
  const hours = Math.trunc(time);
  const mins = Math.round((time - hours) * 60);
  return mins ? `${hours}h ${mins}m` : `${hours}h`;
}

export function toPrettyRange(start: string, end?: string) {
  if (!start) return start;
  const startDate = format(new Date(start), "MMM d hh:mm");
  if (!end) return startDate;
  const sameDay = isSameDay(new Date(start), new Date(end));
  const endDateFormat = sameDay ? "hh:mm" : "MMM d hh:mm";
  const endDate = format(new Date(end), endDateFormat);
  return `${startDate} - ${endDate}`;
}

export function getTaskName(task: ProjectTask) {
  if (task.parent_id) {
    return `${task.parent_id.name} - ${task.name}`;
  }
  return task.name;
}

export const findActiveTimeEntry = (task: ProjectTask): [Timesheet | null, ProjectTask | null] => {
  const timeEntry = task.timesheet_ids.find((te) => !te.end);
  if (timeEntry) return [timeEntry, task];
  let childTimeEntry;
  const childTask = task.child_ids?.find((child) => {
    const timesheet = child.timesheet_ids.find((te) => !te.end);
    if (timesheet) {
      childTimeEntry = timesheet;
      return true;
    }
  });
  if (childTimeEntry && childTask) return [childTimeEntry, childTask];
  return [null, null];
};

export const pushTaskTimeEntry = (task: ProjectTask, timeEntry: Timesheet) => {
  return produce(task, (draft) => {
    if (draft.child_ids?.length) {
      const childIdx = draft.child_ids.findIndex((child) => child.id === task.id);
      if (childIdx !== -1) {
        draft.child_ids[childIdx].timesheet_ids.unshift(timeEntry);
      }
    } else {
      draft.timesheet_ids.unshift(timeEntry);
    }
  });
};

export const replaceTaskTimeEntry = (task: ProjectTask, timeEntry: Timesheet, options: { delete?: boolean } = {}) => {
  return produce(task, (draft) => {
    if (!draft.parent_id) {
      // it's a task
      draft.child_ids?.some((child, childIdx) => {
        const timeIdx = child.timesheet_ids.findIndex((timesheet) => timesheet.id === timeEntry.id);
        if (timeIdx > -1) {
          if (options.delete) {
            draft.child_ids[childIdx].timesheet_ids.splice(timeIdx, 1);
          } else {
            draft.child_ids[childIdx].timesheet_ids[timeIdx] = timeEntry;
          }
          return true;
        }
      });
    } else {
      // it's a subtask
      const timesheetIdx = draft.timesheet_ids.findIndex((timesheet) => timesheet.id === timeEntry.id);
      if (timesheetIdx > -1) {
        if (options.delete) {
          draft.timesheet_ids.splice(timesheetIdx, 1);
        } else {
          draft.timesheet_ids[timesheetIdx] = timeEntry;
        }
      }
    }
  });
};

export const replaceTaskInProjects = (
  projects: Project[],
  projectTask: ProjectTask,
  options: { delete?: boolean } = {},
) => {
  return produce(projects, (drafts) => {
    const projectIdx = drafts.findIndex((draft) => draft.id === projectTask.project_id.id);
    if (projectIdx > -1) {
      if (!projectTask.parent_id) {
        // it's a task
        const taskIdx = drafts[projectIdx].tasks.findIndex((task) => !task.parent_id && task.id === projectTask.id);
        if (options.delete) {
          delete drafts[projectIdx].tasks[taskIdx];
        } else {
          drafts[projectIdx].tasks[taskIdx] = projectTask;
        }
      } else {
        // it's a subtask
        drafts[projectIdx].tasks.some((task, taskIdx) => {
          const childIdx = task.child_ids?.findIndex((child) => child.id === projectTask.id);
          if (childIdx > -1) {
            if (options.delete) {
              delete drafts[projectIdx].tasks[taskIdx].child_ids[childIdx];
            } else {
              drafts[projectIdx].tasks[taskIdx].child_ids[childIdx] = projectTask;
            }
            return true;
          }
        });
      }
    }
  });
};
