import { useSnackbar } from "notistack";
import { shallow } from "zustand/shallow";

import { useEffect } from "react";

import { Grid } from "@mui/material";

import useProjectTaskStore from "@store/projectTaskStore";

import ProjectCard from "@components/ProjectCard";
import TrackingDialog from "@components/TrackingDialog";

Tasks.title = "Tasks List";
Tasks.requireLogin = true;

export default function Tasks() {
  const { enqueueSnackbar } = useSnackbar();
  const { projects, alert, setAlert, fetchProjects } = useProjectTaskStore(
    ({ projects, alert, setAlert, fetchProjects }) => ({ projects, alert, setAlert, fetchProjects }),
    shallow,
  );

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (alert) {
      enqueueSnackbar(alert.message, { variant: alert.type, onClose: () => setAlert(null) });
    }
  }, [alert, enqueueSnackbar, setAlert]);

  return (
    <>
      <Grid container spacing={2} justifyContent="center">
        {projects
          .filter((project) => project.tasks.length)
          .map((project) => (
            <Grid item xs={12} md={9} key={project.id}>
              <ProjectCard project={project} />
            </Grid>
          ))}
      </Grid>
      <TrackingDialog />
    </>
  );
}
