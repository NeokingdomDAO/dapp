import useSWR from "swr";
import { shallow } from "zustand/shallow";

import { useEffect } from "react";

import { Grid, Skeleton } from "@mui/material";

import { fetcher } from "@lib/net";
import { findActiveProjectTask } from "@lib/utils";

import useProjectTaskStore, { Project, useProjectTaskActions } from "@store/projectTaskStore";

import ProjectCard from "@components/ProjectCard";
import TrackingDialog from "@components/TrackingDialog";

Tasks.title = "Tasks List";
Tasks.requireLogin = true;

export default function Tasks() {
  const { data: projects, mutate, isLoading } = useSWR<Project[]>("/api/tasks", fetcher);
  const projectKey = useProjectTaskStore((state) => state.projectKey);
  const { setActiveTask } = useProjectTaskActions();

  useEffect(() => {
    mutate();
  }, [projectKey, mutate]);

  useEffect(() => {
    if (projects) {
      const activeTask = findActiveProjectTask(projects);
      setActiveTask(activeTask);
    }
  }, [projects, setActiveTask]);

  return (
    <>
      <Grid container spacing={2} justifyContent="center">
        {isLoading ? (
          <Grid item xs={12} md={9}>
            <Skeleton sx={{ minHeight: "500px", transform: "none" }} />
          </Grid>
        ) : (
          projects
            ?.filter((project) => project.tasks.length)
            .map((project) => (
              <Grid item xs={12} md={9} key={project.id}>
                <ProjectCard project={project} />
              </Grid>
            ))
        )}
      </Grid>
      <TrackingDialog />
    </>
  );
}
