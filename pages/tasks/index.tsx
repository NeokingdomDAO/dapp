import Link from "next/link";
import useSWR from "swr";

import { useEffect, useMemo } from "react";

import { Add } from "@mui/icons-material";
import { Box, Button, CircularProgress, Divider, Stack } from "@mui/material";

import { fetcher } from "@lib/net";
import { findActiveProjectTask } from "@lib/utils";

import useProjectTaskStore, { Project, useProjectTaskActions } from "@store/projectTaskStore";

import Section from "@components/Section";
import ProjectCard from "@components/tasks/ProjectCard";
import TaskDialog from "@components/tasks/TaskDialog";
import ElapsedTime from "@components/time-entry/ElapsedTime";

import useUser from "@hooks/useUser";

Tasks.title = "Tasks List";
Tasks.requireLogin = true;
Tasks.fullWidth = true;

export default function Tasks() {
  const { mutateUser } = useUser();
  const { data: projects, error, mutate, isLoading } = useSWR<Project[]>("/api/tasks", fetcher);
  const projectKey = useProjectTaskStore((state) => state.projectKey);
  const projectsWithTasks = useMemo(() => projects?.filter((project) => project.tasks.length) || [], [projects]);

  useEffect(() => {
    mutate(); // force revalidate
  }, [projectKey, mutate]);

  useEffect(() => {
    if (error) {
      mutateUser();
    }
  }, [error, mutateUser]);

  const totalTime = useMemo(() => {
    return (
      projectsWithTasks.reduce((total, project) => {
        return total + project.tasks.reduce((sub, task) => sub + task.effective_hours, 0);
      }, 0) * 3600
    );
  }, [projectsWithTasks]);

  return (
    <>
      <Section inverse sx={{ marginTop: "-24px" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center" justifyContent="space-between">
          <ElapsedTime
            elapsedTime={totalTime}
            hideSeconds
            withLabels
            label="Total unapproved time"
            withBorders
            isLoading={isLoading}
            sx={{ mb: { xs: 1, md: 0 }, mt: { xs: 2, md: 0 } }}
          />
          <Button href="/tasks/new" variant="outlined" startIcon={<Add />} component={Link}>
            New task in different project
          </Button>
        </Stack>
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
