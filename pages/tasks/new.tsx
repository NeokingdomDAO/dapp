import { useSnackbar } from "notistack";

import { useEffect } from "react";

import { Grid, Typography } from "@mui/material";

import useProjectTaskStore from "@store/projectTaskStore";

import TaskForm from "@components/TaskForm";

NewTask.title = "New task";
NewTask.requireLogin = true;

export default function NewTask() {
  const { enqueueSnackbar } = useSnackbar();
  const { alert } = useProjectTaskStore(({ alert }) => ({ alert }));

  useEffect(() => {
    if (alert) {
      enqueueSnackbar(alert.message, { variant: alert.type });
    }
  }, [alert, enqueueSnackbar]);

  return (
    <>
      <Grid container spacing={2} justifyContent="center">
        <Grid item sx={{ display: "flex", justifyContent: "center" }} xs={12} md={9}>
          <Typography variant="h3">New Task</Typography>
        </Grid>
        <Grid item xs={12} md={9}>
          <TaskForm onConfirm={(data) => console.log(data)} />
        </Grid>
      </Grid>
    </>
  );
}
