import { useRouter } from "next/router";

import { Grid, Typography } from "@mui/material";

import useProjectTaskStore from "@store/projectTaskStore";

import TaskForm from "@components/TaskForm";

import { useSnackbar } from "@hooks/useSnackbar";

NewTask.title = "New task";
NewTask.requireLogin = true;

export default function NewTask() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const createTask = useProjectTaskStore(enqueueSnackbar)((state) => state.createTask);

  return (
    <>
      <Grid container spacing={2} justifyContent="center">
        <Grid item sx={{ display: "flex", justifyContent: "center" }} xs={12} md={9}>
          <Typography variant="h3">New Task</Typography>
        </Grid>
        <Grid item xs={12} md={9}>
          <TaskForm
            onConfirm={async (data) => {
              const task = await createTask(data);
              if (task) router.push("/tasks");
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}
