import Link from "next/link";
import useSWR from "swr";

import { useEffect, useMemo } from "react";

import { Add } from "@mui/icons-material";
import { Box, Button, CircularProgress, Divider } from "@mui/material";

import { fetcher } from "@lib/net";
import { findActiveProjectTask } from "@lib/utils";

import useProjectTaskStore, { Project, useProjectTaskActions } from "@store/projectTaskStore";

import Section from "@components/Section";
import ProjectCard from "@components/tasks/ProjectCard";
import TaskDialog from "@components/tasks/TaskDialog";

import useUser from "@hooks/useUser";

Tasks.title = "Tasks List";
Tasks.requireLogin = true;
Tasks.fullWidth = true;

export default function Tasks() {
  const { mutateUser } = useUser();
  const { data: projects, error, mutate, isLoading } = useSWR<Project[]>("/api/tasks", fetcher);
  const projectKey = useProjectTaskStore((state) => state.projectKey);
  const { setActiveTask } = useProjectTaskActions();
  const projectsWithTasks = useMemo(() => projects?.filter((project) => project.tasks.length) || [], [projects]);
  console.log("projects: ", projects);
  console.log("projectsWithTasks: ", projectsWithTasks);

  useEffect(() => {
    mutate(); // force revalidate
  }, [projectKey, mutate]);

  useEffect(() => {
    if (error) {
      mutateUser();
    }
  }, [error, mutateUser]);

  useEffect(() => {
    if (projectsWithTasks) {
      const activeTask = findActiveProjectTask(projectsWithTasks);
      setActiveTask(activeTask);
    }
  }, [projectsWithTasks, setActiveTask]);

  return (
    <>
      <Section inverse sx={{ marginTop: "-24px" }}>
        <Button href="/tasks/new" variant="outlined" startIcon={<Add />} component={Link}>
          New task in different project
        </Button>
      </Section>
      {isLoading && (
        <Section>
          <CircularProgress />
        </Section>
      )}
      {!error && !isLoading && projectsWithTasks.length > 0 && (
        <Section>
          <>
            {projectsWithTasks.map((project, idx) => (
              <Box key={project.id}>
                <ProjectCard project={project} />
                {idx < projectsWithTasks.length - 1 && <Divider sx={{ mt: 2, mb: 2 }} />}
              </Box>
            ))}
          </>
        </Section>
      )}
      <TaskDialog />
    </>
  );
}
