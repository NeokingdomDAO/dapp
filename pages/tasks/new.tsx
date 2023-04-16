import { useRouter } from "next/router";

import { Grid, Typography } from "@mui/material";

import { useProjectTaskActions } from "@store/projectTaskStore";

import TaskForm from "@components/tasks/TaskForm";

import useErrorHandler from "@hooks/useErrorHandler";

NewTask.title = "New task";
NewTask.requireLogin = true;

export default function NewTask() {
  const router = useRouter();
  const {
    query: { projectId },
  } = router;
  const { handleError } = useErrorHandler();
  const actions = useProjectTaskActions();
  const createTask = handleError(actions.createTask);

  return (
    <>
      <Grid container spacing={2} justifyContent="center">
        <Grid item sx={{ display: "flex", justifyContent: "center" }} xs={12} md={9}>
          <Typography variant="h3">New Task</Typography>
        </Grid>
        <Grid item xs={12} md={9}>
          <TaskForm
            projectId={Number(projectId)}
            onConfirm={async (data) => {
              const { error } = await createTask(data);
              if (!error) router.push("/tasks");
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}
