import { format, isSameDay } from "date-fns";
import produce from "immer";

import { Project, ProjectTask, Timesheet } from "@store/projectTaskStore";

import { META } from "../pages/_document";
import { STAGE_NAMES_MAP, STAGE_TO_ID_MAP } from "./constants";

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

// PROJECTS TASKS UTILS
export function getTaskTotalHours(task: ProjectTask) {
  if (!task.parent_id && task.child_ids?.length) {
    // it's a task with subtasks
    return (
      task.child_ids?.reduce((tot, child) => {
        tot += getTaskTotalHours(child);
        return tot;
      }, 0) || 0
    );
  } else {
    return task.timesheet_ids.reduce((tot, time) => (tot += time.unit_amount), 0);
  }
}

export function setTaskStatus(task: ProjectTask, stageName: string) {
  return produce(task, (draft) => {
    draft.stage_id = { id: STAGE_TO_ID_MAP[stageName], name: STAGE_NAMES_MAP[stageName] };
  });
}

export function toPrettyDuration(time: number) {
  const hours = Math.trunc(time);
  const mins = Math.round((time - hours) * 60);
  return mins ? `${hours}h ${mins}m` : `${hours}h`;
}

export function toPrettyRange(start: string, end?: string) {
  if (!start) return start;
  const startDate = format(new Date(start), "MMM d, HH:mm");
  if (!end) return startDate;
  const sameDay = isSameDay(new Date(start), new Date(end));
  const endDateFormat = sameDay ? "HH:mm" : "MMM d, HH:mm";
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

export const replaceTaskTimeEntry = (
  task: ProjectTask,
  timeEntry: Timesheet,
  options: { delete?: boolean; add?: boolean } = {},
) => {
  return produce(task, (draft) => {
    if (!draft.parent_id && draft.child_ids?.length) {
      // it's a task with subtasks
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
      // it's a task or subtask
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

export const addTaskTimeEntry = (task: ProjectTask, timeEntry: Timesheet) => {
  return produce(task, (draft) => {
    draft.timesheet_ids.unshift(timeEntry);
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

export const addTaskInProjects = (projects: Project[], task: ProjectTask) => {
  return produce(projects, (drafts) => {
    const projectIdx = drafts.findIndex((draft) => draft.id === task.project_id.id);
    if (projectIdx > -1) {
      if (!task.parent_id) {
        drafts[projectIdx].tasks.push(task);
      } else {
        // it's a subtask
        const parentIdx = drafts[projectIdx].tasks.findIndex((parent) => parent.id === task.parent_id?.id);
        if (parentIdx > 1) {
          drafts[projectIdx].tasks[parentIdx].child_ids.push(task);
        }
      }
    }
  });
};

export const stageToColor = (stage: string): any => {
  if (!stage) return "default";
  const stageName = stage.toLowerCase().split(" ").join("");
  const stageToColorMap: { [key: string]: string } = {
    created: "default",
    inprogress: "primary",
    done: "success",
    approved: "warning",
  };
  return stageToColorMap[stageName] || "default";
};
