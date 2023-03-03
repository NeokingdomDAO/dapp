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
  const { projects, error, fetchProjects } = useProjectTaskStore(
    ({ projects, error, fetchProjects }) => ({ projects, error, fetchProjects }),
    shallow,
  );

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  }, [error, enqueueSnackbar]);

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
