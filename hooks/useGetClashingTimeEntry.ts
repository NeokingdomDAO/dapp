import { Task } from "types";

import { useMemo } from "react";

import { Timesheet } from "@store/projectTaskStore";

import useUserProjects from "./useUserProjects";

type EnhancedEntry = Timesheet & { parent: Task };

export default function useGetClashingTimeEntry({
  startTime,
  endTime,
  timeEntryId,
}: {
  startTime: Date;
  endTime: Date;
  timeEntryId: number | undefined | null;
}) {
  const { userTasks } = useUserProjects();

  const clashingEntry = useMemo(() => {
    const allTimeEntries: Timesheet[] = userTasks.reduce((allEntries, task) => {
      return [...allEntries, ...task.timesheet_ids].map((entry) => ({
        ...entry,
        parent: task,
      }));
    }, []);

    return allTimeEntries.find(
      (entry) =>
        (entry.id !== timeEntryId &&
          startTime.getTime() >= entry.start * 1000 &&
          entry?.end &&
          startTime.getTime() <= entry?.end * 1000) ||
        (startTime.getTime() < entry?.start * 1000 && endTime.getTime() >= entry.start * 1000),
    ) as EnhancedEntry | undefined;
  }, [userTasks, startTime, endTime]);

  return clashingEntry;
}
