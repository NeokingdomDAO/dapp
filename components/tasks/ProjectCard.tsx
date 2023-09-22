import Link from "next/link";

import { useEffect, useMemo, useState } from "react";

import { Add, Visibility, VisibilityOff } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import { STAGE_TO_ID_MAP } from "@lib/constants";

import { Project, ProjectTask } from "@store/projectTaskStore";

import Modal from "@components/Modal";
import TimeEntryFormStatic from "@components/time-entry/FormStatic";

import useUserSettings from "@hooks/useUserSettings";

import Task from "./Task";
import TaskCard from "./TaskCard";

export default function ProjectCard({ project }: { project: Project }) {
  const [hideCompleted, setHideCompleted] = useState(true);
  const [currentTaskId, setCurrentTaskId] = useState<null | number>(null);

  const { openProjects, setOpenProjects } = useUserSettings();
  const expanded = openProjects.includes(project.id);

  const tasks = useMemo(
    () =>
      project.tasks
        .filter((task) => task !== null)
        .filter(
          (task) =>
            !task.parent_id && ![STAGE_TO_ID_MAP["approved"], STAGE_TO_ID_MAP["done"]].includes(task.stage_id.id),
        ),
    [project],
  );
  const completedTasks = useMemo(
    () =>
      project.tasks
        .filter((task) => task !== null)
        .filter((task) => !task.parent_id && task.stage_id.id === STAGE_TO_ID_MAP["done"]),
    [project],
  );

  const handleAddNewEntry = (taskId: number) => {
    setCurrentTaskId(taskId);
  };

  const handleToggle = () => {
    const newOpenProjects = openProjects.includes(project.id)
      ? openProjects.filter((id) => id !== project.id)
      : [...openProjects, project.id];

    setOpenProjects(newOpenProjects);
  };

  const handleDeleteTimeEntry = async (timeEntryId: number, task: ProjectTask) => {
    if (task.timesheet_ids.length === 1) {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        body: JSON.stringify({ stage_id: STAGE_TO_ID_MAP["created"] }),
      });
    }
    const response = await fetch(`/api/time_entries/${timeEntryId}`, { method: "DELETE" });
    if (response.ok) {
      // set({ projectKey: uuid(), isLoading: false });
      // return { alert: { message: "Time Entry successfully deleted!", variant: "success" } };
    } else {
      // set({ isLoading: false });
      // return { error: await buildError(response) };
    }
  };

  return (
    <Box sx={{ borderLeft: "2px solid", borderColor: "divider", pl: 2 }}>
      {currentTaskId && (
        <Modal
          open
          sx={{ bgcolor: (t) => (t.palette.mode === "dark" ? "#1A1A1A" : "#FAFAFA") }}
          onClose={() => setCurrentTaskId(null)}
        >
          <TimeEntryFormStatic taskId={currentTaskId} onSaved={() => setCurrentTaskId(null)} />
        </Modal>
      )}
      <Stack
        direction="row"
        alignItems="center"
        divider={<Divider flexItem />}
        spacing={4}
        justifyContent="space-between"
      >
        <Typography
          variant="h6"
          component="div"
          role="button"
          aria-label="open-time-entries"
          onClick={handleToggle}
          sx={{ cursor: "pointer" }}
        >
          {project.name}
        </Typography>
        <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1} alignItems="center">
          <Button
            component={Link}
            href={`/tasks/new?projectId=${project.id}`}
            variant="outlined"
            startIcon={<Add />}
            size="small"
          >
            New Task
          </Button>
          <IconButton
            aria-label="togggle"
            color="primary"
            size="small"
            onClick={handleToggle}
            sx={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s ease-in" }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Stack>
      </Stack>
      <Collapse in={expanded} timeout="auto">
        {tasks.map((task) => (
          <Task key={task.id} task={task} onAddNewEntry={handleAddNewEntry} onDeleteTimeEntry={handleDeleteTimeEntry} />
        ))}
      </Collapse>
    </Box>
  );

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        position: "relative",
        pb: 0,
      }}
    >
      <CardHeader title={project.name} sx={{ pb: 0 }} />
      <Box sx={{ padding: "0 16px", mt: 1, display: "flex", justifyContent: "right" }}>
        {Boolean(completedTasks.length) && (
          <Button
            variant="outlined"
            size="small"
            startIcon={hideCompleted ? <Visibility /> : <VisibilityOff />}
            onClick={() => setHideCompleted(!hideCompleted)}
          >
            {hideCompleted ? "Show" : "Hide"} Completed ({completedTasks.length})
          </Button>
        )}
        <Button
          component={Link}
          href={`/tasks/new?projectId=${project.id}`}
          sx={{ ml: 1 }}
          variant="outlined"
          color="success"
          startIcon={<Add />}
          size="small"
        >
          New Task
        </Button>
      </Box>
      <CardContent sx={{ pt: 0, pb: 0 }}>
        {!hideCompleted && completedTasks.map((task) => <TaskCard key={task.id} task={task} />)}
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </CardContent>
    </Card>
  );
}
