import { shallow } from "zustand/shallow";

import { useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ListIcon from "@mui/icons-material/List";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import {
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";

import { STAGE_TO_ID_MAP } from "@lib/constants";

import useProjectTaskStore, { ProjectTask, Timesheet } from "@store/projectTaskStore";
import useTimeEntryStore from "@store/timeEntry";

import Dialog from "@components/Dialog";
import ElapsedTime from "@components/time-entry/ElapsedTime";

import { useSnackbar } from "@hooks/useSnackbar";
import useUserSettings from "@hooks/useUserSettings";

import TimeEntries from "./TimeEntries";

const hoursToSeconds = (hours: number) => hours * 3600;

const getTick = (hasPlayButton: boolean): SxProps<Theme> => ({
  position: "relative",
  "&:before": {
    content: `""`,
    position: "absolute",
    width: 10,
    height: "2px",
    transform: "rotate(180deg)",
    bgcolor: "divider",
    top: hasPlayButton ? 19 : 16,
    left: -16,
    transition: "all .2s ease-out",
  },
  "&:hover:before": {
    bgcolor: "primary.main",
  },
});

export default function Task({
  task,
  isSubtask = false,
  parentTask,
  onAddNewEntry,
  onDeleteTimeEntry,
}: {
  task: ProjectTask;
  parentTask?: ProjectTask;
  isSubtask?: boolean;
  onAddNewEntry: (taskId: number) => void;
  onDeleteTimeEntry: (timeEntry: Timesheet, task: ProjectTask) => void;
}) {
  const { start, stop, startAt, setTaskId, taskId } = useTimeEntryStore(
    (state) => ({
      start: state.start,
      stop: state.stop,
      startAt: state.startAt,
      taskId: state.taskId,
      setTaskId: state.setTaskId,
    }),
    shallow,
  );

  const [deletingTask, setDeletingTask] = useState<null | ProjectTask>(null);
  const [markAsDoneTask, setMarkAsDoneTask] = useState<null | ProjectTask>(null);
  const { openTasks, setOpenTasks } = useUserSettings();
  const expanded = openTasks.includes(task.id);
  const { deleteTask, loadingTask, markTaskAsDone, setAddingTask, setUpdatingTask } = useProjectTaskStore((state) => ({
    deleteTask: state.actions.deleteTask,
    markTaskAsDone: state.actions.markTaskAsDone,
    loadingTask: state.loadingTask,
    setAddingTask: state.actions.setAddingTask,
    setUpdatingTask: state.actions.setUpdatingTask,
  }));

  const { enqueueSnackbar } = useSnackbar();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const isDone = task.stage_id.id === STAGE_TO_ID_MAP["done"];

  const handleToggle = () => {
    const newOpenTasks = openTasks.includes(task.id)
      ? openTasks.filter((id) => id !== task.id)
      : [...openTasks, task.id];

    setOpenTasks(newOpenTasks);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStart = () => {
    setTaskId(task.id);
    start();
  };

  const handleUpdateTask = () => {
    handleClose();
    setUpdatingTask(task);
  };

  const handleBeforeDeleteTask = () => {
    handleClose();
    setDeletingTask(task);
  };

  const handleDeleteTask = async () => {
    const { alert, error } = await deleteTask(task);
    setDeletingTask(null);
    if (alert) {
      return enqueueSnackbar(alert.message, { variant: alert.variant });
    }

    enqueueSnackbar(error.message, { variant: "error" });
  };

  const handleBeforeMarkAsDone = () => {
    handleClose();
    setMarkAsDoneTask(task);
  };

  const handleMarkAsDone = async () => {
    const { alert, error } = await markTaskAsDone(task);
    setMarkAsDoneTask(null);
    if (alert) {
      const newOpenTasks = openTasks.filter((id) => id !== task.id);
      setOpenTasks(newOpenTasks);
      return enqueueSnackbar(alert.message, { variant: alert.variant });
    }

    enqueueSnackbar(error.message, { variant: "error" });
  };

  const handleCreateSubtask = async () => {
    handleClose();
    setAddingTask({ parentTask: task, projectId: task.project_id.id });
  };

  const handleAddTimeEntry = () => {
    handleClose();
    onAddNewEntry(task.id);
  };

  const handleDeleteTimeEntry = (timeEntry: Timesheet) => {
    handleClose();
    onDeleteTimeEntry(timeEntry, task);
  };

  const elapsedTime = hoursToSeconds(task.effective_hours || 0);

  const canTrackTime = (task.child_ids?.length || 0) === 0;
  const hasTimeEntries = (task.timesheet_ids?.length || 0) > 0;

  return (
    <Box
      sx={{
        mt: 0.8,
        mb: 0.8,
        ...(isSubtask ? { ml: 2 } : getTick(canTrackTime)),
        ...(loadingTask === task.id && { opacity: 0.3, pointerEvents: "none" }),
      }}
    >
      <Dialog
        open={!!deletingTask}
        handleClose={() => setDeletingTask(null)}
        handleApprove={handleDeleteTask}
        descriptionId="dialog-delete-task"
        title={isSubtask ? "Delete Subtask" : "Delete Task"}
      >
        <Typography variant="body1">
          Are you sure you want to delete the {isSubtask ? "subtask" : "task"} <b>{task.name}</b>?
        </Typography>
      </Dialog>
      <Dialog
        open={!!markAsDoneTask}
        handleClose={() => setMarkAsDoneTask(null)}
        handleApprove={handleMarkAsDone}
        descriptionId="dialog-mark-task-as-done"
        title={isSubtask ? "Mark subtask as done" : "Mark task as done"}
      >
        <Typography variant="body1">
          Are you sure you want to mark {isSubtask ? "subtask" : "task"} <b>{task.name}</b> as done?
        </Typography>
      </Dialog>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1} alignItems="center">
          {(isSubtask || canTrackTime) && !isDone && (
            <IconButton
              aria-label="start"
              color="primary"
              onClick={() => (!startAt ? handleStart() : stop())}
              sx={{ border: "1px solid", borderColor: "divider" }}
              size="small"
              disabled={!!startAt && taskId !== task.id}
            >
              {startAt && taskId === task.id ? <StopCircleIcon /> : <PlayArrowIcon />}
            </IconButton>
          )}
          {isDone && <CheckCircleIcon sx={{ fill: (t) => t.palette.success.main, ml: 0.1 }} fontSize="large" />}
          <Typography
            variant="body1"
            component="div"
            role="button"
            aria-label="open-time-entries"
            onClick={handleToggle}
            sx={{ cursor: "pointer" }}
          >
            {task.name}
          </Typography>
        </Stack>
        <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1} alignItems="center">
          {canTrackTime && elapsedTime > 0 && (
            <ElapsedTime elapsedTime={elapsedTime} hideSeconds withLabels size="small" />
          )}
          {(taskId !== task.id || !startAt) && (
            <IconButton aria-label="start" color="primary" size="small" onClick={handleClick}>
              <ListIcon />
            </IconButton>
          )}
          <IconButton
            aria-label="toggle"
            color="primary"
            size="small"
            onClick={handleToggle}
            sx={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s ease-in" }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Stack>
      </Stack>
      <Menu
        id="task-menu"
        aria-labelledby="task-menu-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {canTrackTime &&
          !isDone && [
            <MenuItem onClick={handleAddTimeEntry} key="n-t-e">
              New time entry
            </MenuItem>,
            <Divider key="divider" />,
          ]}
        {!isSubtask &&
          !isDone &&
          (!canTrackTime || !hasTimeEntries) && [
            <MenuItem onClick={handleCreateSubtask} key="n-s">
              New SubTask
            </MenuItem>,
            <Divider key="divider" />,
          ]}
        {!isDone && <MenuItem onClick={handleUpdateTask}>{isSubtask ? "Update subtask" : "Update task"}</MenuItem>}
        <MenuItem onClick={handleBeforeDeleteTask}>{isSubtask ? "Delete subtask" : "Delete task"}</MenuItem>
        {hasTimeEntries &&
          !isDone && [
            <Divider key="divider" />,
            <MenuItem key="m-a-d" onClick={handleBeforeMarkAsDone}>
              Mark as done
            </MenuItem>,
          ]}
      </Menu>
      {!isSubtask && task.child_ids.length > 0 && (
        <Collapse in={expanded} timeout="auto">
          <Box>
            {task.child_ids.map((subTask) => (
              <Task
                task={subTask}
                isSubtask
                key={subTask.id}
                onAddNewEntry={onAddNewEntry}
                onDeleteTimeEntry={onDeleteTimeEntry}
                parentTask={task}
              />
            ))}
          </Box>
        </Collapse>
      )}
      {canTrackTime && (
        <Collapse in={expanded} timeout="auto">
          <TimeEntries
            taskId={task.id}
            entries={task.timesheet_ids}
            onAddNew={() => onAddNewEntry(task.id)}
            onDelete={handleDeleteTimeEntry}
            showNewEntryButton={(taskId !== task.id || !startAt) && !isDone}
            otherCta={
              !isSubtask &&
              !isDone &&
              (!canTrackTime || !hasTimeEntries) && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleCreateSubtask}
                  startIcon={<AddIcon />}
                  sx={{ ml: 1 }}
                >
                  New Subtask
                </Button>
              )
            }
          />
        </Collapse>
      )}
    </Box>
  );
}
