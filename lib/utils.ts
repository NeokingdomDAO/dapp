import { format, isSameDay } from "date-fns";

import { ProjectTask } from "@store/projectTaskStore";

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
