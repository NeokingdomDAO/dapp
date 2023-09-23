import Link from "next/link";
import useSWR from "swr";

import { useEffect, useMemo } from "react";

import { Add } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, CircularProgress, Divider, Stack } from "@mui/material";

import { fetcher } from "@lib/net";

import useProjectTaskStore, { Project, useProjectTaskActions } from "@store/projectTaskStore";

import Section from "@components/Section";
import ProjectCard from "@components/tasks/ProjectCard";
import TaskDialog from "@components/tasks/TaskDialog";
import ElapsedTime from "@components/time-entry/ElapsedTime";

import useUser from "@hooks/useUser";
import useUserSettings from "@hooks/useUserSettings";

Tasks.title = "Tasks List";
Tasks.requireLogin = true;
Tasks.fullWidth = true;

export default function Tasks() {
  const { mutateUser } = useUser();
  const { data: projects, error, mutate, isLoading } = useSWR<Project[]>("/api/tasks", fetcher);
  const projectKey = useProjectTaskStore((state) => state.projectKey);
  const projectsWithTasks = useMemo(() => projects?.filter((project) => project.tasks.length) || [], [projects]);
  const { openProjects, openTasks, setOpenTasks, setOpenProjects } = useUserSettings();

  useEffect(() => {
    mutate(); // force revalidate
  }, [projectKey, mutate]);

  useEffect(() => {
    if (error) {
      mutateUser();
    }
  }, [error, mutateUser]);

  const [totalTime, projectIds, taskIds] = useMemo(() => {
    const projectIds = projectsWithTasks.map((project) => project.id);
    const totalTime =
      projectsWithTasks.reduce((total, project) => {
        return total + project.tasks.reduce((sub, task) => sub + task.effective_hours, 0);
      }, 0) * 3600;
    const taskIds = projectsWithTasks.reduce((ids, project) => {
      return [...ids, ...project.tasks.filter((task) => task.child_ids.length > 0).map((task) => task.id)];
    }, [] as number[]);

    return [totalTime, projectIds, taskIds];
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
            {projectsWithTasks.length > 1 && (
              <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2, mt: -2 }}>
                <Button
                  size="small"
                  variant="outlined"
                  endIcon={<ExpandMoreIcon />}
                  onClick={() => {
                    if (openProjects.length > 0) {
                      setOpenProjects([]);
                      setOpenTasks([]);
                    } else {
                      setOpenProjects(projectIds);
                      setOpenTasks(taskIds);
                    }
                  }}
                  sx={{
                    "& svg": {
                      transform: openProjects.length > 0 ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform .2s ease-in",
                    },
                  }}
                >
                  {openProjects.length > 0 ? "collapse all" : "expand all"}
                </Button>
              </Stack>
            )}
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
