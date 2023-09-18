import { shallow } from "zustand/shallow";

import { useState } from "react";

import ListIcon from "@mui/icons-material/List";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { Box, Divider, IconButton, Menu, MenuItem, Stack, Typography } from "@mui/material";

import { ProjectTask } from "@store/projectTaskStore";
import useTimeEntryStore from "@store/timeEntry";

import ElapsedTime from "@components/time-entry/ElapsedTime";

import TaskTimeEntry from "./TaskTimeEntry";

const DEFAULT_TASK_DURATION = 120000; // 2 mins

const hoursToSeconds = (hours: number) => hours * 3600;

export default function Task({ task, isSubtask = false }: { task: ProjectTask; isSubtask?: boolean }) {
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

  const handleNewTimeEntry = () => {
    handleClose();
    const startAt = Date.now() - DEFAULT_TASK_DURATION;
    addNew({
      taskId: task.id,
      startAt,
      stopAt: startAt + DEFAULT_TASK_DURATION,
      showStopModal: true,
    });
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

  const elapsedTime = hoursToSeconds(task.effective_hours || 0);

  // const createNewSubTask = () => {
  //   openDialog({
  //     open: true,
  //     title: (
  //       <Box sx={{ display: "flex" }}>
  //         <Box sx={{ fontWeight: "200" }}>New sub-task for</Box>
  //         <Box sx={{ ml: "4px" }}>{task.name}</Box>
  //       </Box>
  //     ),
  //     message: (
  //       <TaskForm
  //         parentTask={task}
  //         onCancel={() => closeDialog()}
  //         onConfirm={(data) => {
  //           createTask({ ...data, parent_id: task.id });
  //           closeDialog();
  //         }}
  //       />
  //     ),
  //   });
  // };

  const canTrackTime = (task.child_ids?.length || 0) === 0;

  return (
    <Box p={1} mt={1} sx={{ "&:hover": { bgcolor: (t) => (t.palette.mode === "dark" ? "#1A1A1A" : "#EEE") } }}>
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
          <Typography variant="body1">{task.name}</Typography>
        </Stack>
        <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1} alignItems="center">
          <ElapsedTime elapsedTime={elapsedTime} hideSeconds withLabels size="small" />
          <IconButton aria-label="start" color="primary" size="small" onClick={handleClick}>
            <ListIcon />
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
        {canTrackTime && <MenuItem onClick={handleNewTimeEntry}>New time entry</MenuItem>}
        <MenuItem onClick={handleNewSubTask}>{isSubtask ? "Update subtask" : "Update task"}</MenuItem>
        {!isSubtask && !canTrackTime && <MenuItem onClick={handleUpdateTask}>New SubTask</MenuItem>}
        <MenuItem onClick={handleDeleteTask}>{isSubtask ? "Delete subtask" : "Delete task"}</MenuItem>
        <MenuItem onClick={handleDeleteTask}>Mark as done</MenuItem>
      </Menu>
      {!isSubtask && (
        <ul>
          {task.child_ids.map((subTask) => (
            <Task task={subTask} isSubtask key={subTask.id} />
          ))}
        </ul>
      )}
      <Box>
        {task.timesheet_ids.map((timeEntry) => (
          <TaskTimeEntry key={timeEntry.id} timeEntry={timeEntry} />
        ))}
      </Box>
    </Box>
  );
}
