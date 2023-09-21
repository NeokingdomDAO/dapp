import { shallow } from "zustand/shallow";

import { useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ListIcon from "@mui/icons-material/List";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import {
  Box,
  Collapse,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";

import { ProjectTask } from "@store/projectTaskStore";
import useTimeEntryStore from "@store/timeEntry";

import ElapsedTime from "@components/time-entry/ElapsedTime";

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
  },
  "&:hover:before": {
    bgcolor: "primary.main",
  },
});

export default function Task({
  task,
  isSubtask = false,
  onAddNewEntry,
  onDeleteTimeEntry,
}: {
  task: ProjectTask;
  isSubtask?: boolean;
  onAddNewEntry: (taskId: number) => void;
  onDeleteTimeEntry: (timeEntryId: number, task: ProjectTask) => void;
}) {
  const { start, stop, startAt, setTaskId, taskId, addNew } = useTimeEntryStore(
    (state) => ({
      start: state.start,
      stop: state.stop,
      startAt: state.startAt,
      taskId: state.taskId,
      setTaskId: state.setTaskId,
      addNew: state.addNew,
    }),
    shallow,
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
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

  const handleNewSubTask = () => {
    handleClose();
  };

  const handleUpdateTask = () => {
    handleClose();
  };

  const handleDeleteTask = () => {
    handleClose();
  };

  const handleAddTimeEntry = () => {
    handleClose();
    onAddNewEntry(task.id);
  };

  const handleDeleteTimeEntry = (timeEntryId: number) => {
    handleClose();
    onDeleteTimeEntry(timeEntryId, task);
  };

  const elapsedTime = hoursToSeconds(task.effective_hours || 0);

  const canTrackTime = (task.child_ids?.length || 0) === 0;

  return (
    <Box sx={{ mt: 0.5, mb: 0.5, ...(isSubtask ? { ml: 2 } : getTick(canTrackTime)) }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1} alignItems="center">
          {(isSubtask || canTrackTime) && (
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
          {canTrackTime ? (
            <Typography
              variant="body1"
              component="div"
              role="button"
              aria-label="open-time-entries"
              onClick={handleExpandClick}
              sx={{ cursor: "pointer" }}
            >
              {task.name}
            </Typography>
          ) : (
            <Typography variant="body1">{task.name}</Typography>
          )}
        </Stack>
        <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1} alignItems="center">
          {canTrackTime && <ElapsedTime elapsedTime={elapsedTime} hideSeconds withLabels size="small" />}
          <IconButton aria-label="start" color="primary" size="small" onClick={handleClick}>
            <ListIcon />
          </IconButton>
          {canTrackTime && (
            <IconButton
              aria-label="start"
              color="primary"
              size="small"
              onClick={handleExpandClick}
              sx={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s ease-in" }}
            >
              <ExpandMoreIcon />
            </IconButton>
          )}
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
        {canTrackTime && <MenuItem onClick={handleAddTimeEntry}>New time entry</MenuItem>}
        <MenuItem onClick={handleNewSubTask}>{isSubtask ? "Update subtask" : "Update task"}</MenuItem>
        {!isSubtask && !canTrackTime && <MenuItem onClick={handleUpdateTask}>New SubTask</MenuItem>}
        <MenuItem onClick={handleDeleteTask}>{isSubtask ? "Delete subtask" : "Delete task"}</MenuItem>
        <MenuItem onClick={handleDeleteTask}>Mark as done</MenuItem>
      </Menu>
      {!isSubtask && task.child_ids.length > 0 && (
        <Box>
          {task.child_ids.map((subTask) => (
            <Task
              task={subTask}
              isSubtask
              key={subTask.id}
              onAddNewEntry={onAddNewEntry}
              onDeleteTimeEntry={onDeleteTimeEntry}
            />
          ))}
        </Box>
      )}
      {canTrackTime && (
        <Collapse in={expanded} timeout="auto">
          <TimeEntries
            entries={task.timesheet_ids}
            onAddNew={() => onAddNewEntry(task.id)}
            onDelete={handleDeleteTimeEntry}
          />
        </Collapse>
      )}
    </Box>
  );
}
