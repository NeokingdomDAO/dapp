import Link from "next/link";
import useSWR from "swr";

import { useEffect, useMemo } from "react";

import { Add } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, CircularProgress, Divider, Stack } from "@mui/material";

import { fetcher } from "@lib/net";

import useProjectTaskStore, { Project, ProjectTask } from "@store/projectTaskStore";

import Modal from "@components/Modal";
import Section from "@components/Section";
import ProjectCard from "@components/tasks/ProjectCard";
import TaskDialog from "@components/tasks/TaskDialog";
import TaskForm from "@components/tasks/TaskForm";
import ElapsedTime from "@components/time-entry/ElapsedTime";

import { useSnackbar } from "@hooks/useSnackbar";
import useUser from "@hooks/useUser";
import useUserSettings from "@hooks/useUserSettings";

Tasks.title = "Tasks List";
Tasks.requireLogin = true;
Tasks.fullWidth = true;

export default function Tasks() {
  const { mutateUser } = useUser();
  const { data: projects, error, mutate, isLoading } = useSWR<Project[]>("/api/tasks", fetcher);
  const { projectKey, createTask, setAddingTask, addingTask, updatingTask, updateTask, setUpdatingTask } =
    useProjectTaskStore((state) => ({
      createTask: state.actions.createTask,
      updateTask: state.actions.updateTask,
      setAddingTask: state.actions.setAddingTask,
      addingTask: state.addingTask,
      updatingTask: state.updatingTask,
      setUpdatingTask: state.actions.setUpdatingTask,
      projectKey: state.projectKey,
    }));
  const { enqueueSnackbar } = useSnackbar();
  const projectsWithTasks = useMemo(() => projects?.filter((project) => project.tasks.length) || [], [projects]);
  const { openProjects, setOpenTasks, setOpenProjects } = useUserSettings();

  useEffect(() => {
    mutate(); // force revalidate
  }, [projectKey, mutate]);

  useEffect(() => {
    if (error) {
      mutateUser();
    }
  }, [error, mutateUser]);

  const confirmCreateTaks = async (data: ProjectTask) => {
    const { parentTask } = addingTask || { parentTask: null };
    const { alert, error } = parentTask
      ? // @ts-ignore parent is not null
        await createTask({ ...data, parent_id: parentTask.id })
      : await createTask(data);
    if (alert) {
      setAddingTask(null);
      return enqueueSnackbar(alert.message, { variant: alert.variant });
    }

    enqueueSnackbar(error.message, { variant: "error" });
  };

  const confirmUpdateTask = async (data: Omit<ProjectTask, "id">) => {
    const { alert, error } = await updateTask({ id: updatingTask?.id as number, ...data });
    if (alert) {
      setUpdatingTask(null);
      return enqueueSnackbar(alert.message, { variant: alert.variant });
    }

    enqueueSnackbar(error.message, { variant: "error" });
  };

  const handleCreateTask = (evt: React.MouseEvent<HTMLElement>) => {
    evt.preventDefault();
    setAddingTask({});
  };

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
      {!!addingTask && (
        <Modal
          open
          sx={{ bgcolor: (t) => (t.palette.mode === "dark" ? "#1A1A1A" : "#FAFAFA") }}
          onClose={() => setAddingTask(null)}
        >
          <TaskForm
            projectId={addingTask?.projectId}
            onConfirm={confirmCreateTaks}
            {...(addingTask.parentTask && { parentTask: addingTask.parentTask })}
          />
        </Modal>
      )}
      {!!updatingTask && (
        <Modal
          open
          sx={{ bgcolor: (t) => (t.palette.mode === "dark" ? "#1A1A1A" : "#FAFAFA") }}
          onClose={() => setUpdatingTask(null)}
        >
          <TaskForm task={updatingTask} onConfirm={confirmUpdateTask} />
        </Modal>
      )}
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
          <Button href="/tasks/new" onClick={handleCreateTask} variant="outlined" startIcon={<Add />} component={Link}>
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
