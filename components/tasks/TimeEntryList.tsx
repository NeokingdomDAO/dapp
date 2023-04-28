import { useEffect, useState } from "react";

import { MoreTimeOutlined } from "@mui/icons-material";
import { Box, Grid, Typography, useTheme } from "@mui/material";

import { ProjectTask, useProjectTaskActions } from "@store/projectTaskStore";

import useErrorHandler from "../../hooks/useErrorHandler";
import { toPrettyDuration } from "../../lib/utils";
import ActionCardBtn from "./ActionBtn";
import TimeEntry from "./TimeEntry";
import TimeEntryForm from "./TimeEntryForm";

export default function TimeEntryList({ task, showNewTimeEntry }: { task: ProjectTask; showNewTimeEntry?: boolean }) {
  const theme = useTheme();
  const [newTimeEntry, addNewTimeEntry] = useState<boolean>(false);
  const { handleError } = useErrorHandler();
  const actions = useProjectTaskActions();
  const createTimeEntry = handleError(actions.createTimeEntry);

  useEffect(() => {
    addNewTimeEntry(!!showNewTimeEntry);
  }, [showNewTimeEntry]);

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography>
          <strong>Total time:</strong> <span>{toPrettyDuration(task.effective_hours)}</span>
        </Typography>
        <ActionCardBtn onClick={() => addNewTimeEntry(!newTimeEntry)}>
          <MoreTimeOutlined sx={{ fontSize: "1rem", mr: "3px" }} />
          <span>New Time Entry</span>
        </ActionCardBtn>
      </Box>
      <Grid container sx={{ m: 0, width: "100%" }} spacing={0}>
        {newTimeEntry && (
          <Grid item sx={{ pl: 0, pt: 0, p: 0 }} xs={12} sm={4}>
            <Box
              sx={{
                m: "5px",
                ml: 0,
                p: "5px",
                borderRadius: "3px",
                border: `1px solid ${theme.palette.divider}`,
                position: "relative",
              }}
            >
              <TimeEntryForm
                onConfirm={(data) => {
                  createTimeEntry(data, task);
                  addNewTimeEntry(false);
                }}
                onCancel={() => addNewTimeEntry(false)}
              />
            </Box>
          </Grid>
        )}
        {task.timesheet_ids.map((timeEntry) => (
          <Grid item sx={{ pl: 0, pt: 0, p: 0 }} xs={12} sm={4} key={timeEntry.id}>
            <TimeEntry task={task} timeEntry={timeEntry} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
