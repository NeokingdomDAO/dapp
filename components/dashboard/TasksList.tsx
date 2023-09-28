import { format } from "date-fns";

import { Box, Chip, Paper, Skeleton, Stack, Typography } from "@mui/material";

import { getDateFromOdooTimestamp, hoursToTime } from "@lib/utils";

import TimeEntries from "@components/tasks/TimeEntries";
import ElapsedTime from "@components/time-entry/ElapsedTime";

import { Task } from "../../types";
import User from "../User";

export default function TasksList({
  tasks,
  isLoading,
  showUser = true,
}: {
  tasks: Task[];
  isLoading: boolean;
  showUser?: boolean;
}) {
  return (
    <>
      {isLoading
        ? [...new Array(3).keys()].map((index) => (
            <Paper key={index} sx={{ p: 2, mb: 1, display: "flex", alignItems: "center" }}>
              <Box sx={{ mr: 2, width: "80%" }}>
                {showUser && <User isSkeleton />}
                <Typography variant="h6" sx={{ mt: 1 }}>
                  <Skeleton />
                </Typography>
                <Typography variant="caption">
                  <Skeleton />
                </Typography>
              </Box>
              <Paper sx={{ ml: "auto", textAlign: "center", p: 2, width: 130 }} variant="outlined">
                <Typography variant="caption">
                  <Skeleton />
                </Typography>
                <Typography variant="h6">
                  <Skeleton />
                </Typography>
                <Typography variant="caption">
                  <Skeleton />
                </Typography>
              </Paper>
            </Paper>
          ))
        : tasks?.map((task) => (
            <Paper key={task.id} sx={{ p: 2.5, pb: 1.8, mb: 2 }}>
              <Stack direction="row" alignItems="center">
                <Box sx={{ mr: 2, mb: 1 }}>
                  {showUser && task.user_id?.ethereum_address && (
                    <User address={task.user_id?.ethereum_address} shortAddress />
                  )}
                  <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
                    {task.name}
                    {task.parent_id ? ` - ${task.parent_id.name}` : ""}
                  </Typography>
                  <Chip sx={{ mr: 2 }} label={task.project_id.name} size="small" />
                  <Typography variant="caption">
                    Updated on: {format(getDateFromOdooTimestamp(task.write_date), "dd LLL yyyy, H:mm:ss")}
                  </Typography>
                </Box>
                <ElapsedTime
                  elapsedTime={(task.subtask_effective_hours + task.effective_hours) * 3600}
                  hideSeconds
                  withLabels
                  sx={{ ml: "auto" }}
                />
              </Stack>
              <TimeEntries entries={task.timesheet_ids} readOnly taskId={task.id} />
            </Paper>
          ))}
    </>
  );
}
