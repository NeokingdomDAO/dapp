import { shallow } from "zustand/shallow";

import { useEffect } from "react";

import { Grid } from "@mui/material";

import useProjectTaskStore from "@store/projectTaskStore";

import ProjectCard from "@components/ProjectCard";
import TrackingDialog from "@components/TrackingDialog";

Tasks.title = "Tasks List";
Tasks.requireLogin = true;

export default function Tasks() {
  const { projects, fetchProjects } = useProjectTaskStore(
    ({ projects, fetchProjects }) => ({ projects, fetchProjects }),
    shallow,
  );

  useEffect(() => {
    fetchProjects();
  }, []);

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
