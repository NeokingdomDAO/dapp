import Link from "next/link";

import { useMemo, useState } from "react";

import { Add } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, Collapse, Divider, IconButton, Stack, Typography } from "@mui/material";

import { STAGE_TO_ID_MAP } from "@lib/constants";

import useProjectTaskStore, { Project, ProjectTask, Timesheet } from "@store/projectTaskStore";

import Modal from "@components/Modal";
import TimeEntryFormStatic from "@components/time-entry/FormStatic";

import { useSnackbar } from "@hooks/useSnackbar";
import useUserSettings from "@hooks/useUserSettings";

import Task from "./Task";

export default function ProjectCard({ project }: { project: Project }) {
  const [currentTaskId, setCurrentTaskId] = useState<null | number>(null);

  const { openProjects, setOpenProjects } = useUserSettings();
  const expanded = openProjects.includes(project.id);
  const { deleteTimeEntry, setAddingTask } = useProjectTaskStore((state) => ({
    deleteTimeEntry: state.actions.deleteTimeEntry,
    setAddingTask: state.actions.setAddingTask,
  }));
  const { enqueueSnackbar } = useSnackbar();

  const tasks = useMemo(
    () =>
      project.tasks
        .filter((task) => task !== null)
        .filter((task) => !task.parent_id && task.stage_id.id !== STAGE_TO_ID_MAP["approved"]),
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

  const handleDeleteTimeEntry = async (timeEntry: Timesheet, task: ProjectTask) => {
    const { alert, error } = await deleteTimeEntry(timeEntry, task);
    if (alert) {
      return enqueueSnackbar(alert.message, { variant: alert.variant });
    }

    enqueueSnackbar(error.message, { variant: "error" });
  };

  const handleCreateTask = (evt: React.MouseEvent<HTMLElement>) => {
    evt.preventDefault();
    setAddingTask({ projectId: project.id });
  };

  return (
    <Box
      sx={{
        transition: "all .2s ease-in-out",
        ...(expanded ? { borderLeft: "2px solid", borderColor: "divider", pl: 2 } : {}),
      }}
    >
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
          sx={{ cursor: "pointer", lineHeight: 1.3 }}
        >
          {project.name}
        </Typography>
        <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1} alignItems="center">
          <Button
            component={Link}
            href={`/tasks/new?projectId=${project.id}`}
            onClick={handleCreateTask}
            variant="outlined"
            startIcon={<Add />}
            size="small"
            sx={{ whiteSpace: "nowrap", ml: 1 }}
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
}
