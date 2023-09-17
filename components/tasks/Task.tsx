import { shallow } from "zustand/shallow";

import { useState } from "react";

import ListIcon from "@mui/icons-material/List";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { Box, Divider, IconButton, Menu, MenuItem, Stack, Typography } from "@mui/material";

import { ProjectTask } from "@store/projectTaskStore";
import useTimeEntryStore from "@store/timeEntry";

import ElapsedTime from "@components/time-entry/ElapsedTime";

export default function Task({ task }: { task: ProjectTask }) {
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
    const now = Date.now();
    addNew({
      taskId: task.id,
      startAt: now,
      stopAt: now + 60000,
      showStopModal: true,
    });
  };

  return (
    <Box p={1} mt={1} sx={{ "&:hover": { bgcolor: (t) => (t.palette.mode === "dark" ? "#1A1A1A" : "#EEE") } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1} alignItems="center">
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
          <Typography variant="body1">{task.name}</Typography>
        </Stack>
        <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1} alignItems="center">
          <ElapsedTime elapsedTime={1000} hideSeconds withLabels size="small" />
          <IconButton aria-label="start" color="primary" size="small" onClick={handleClick}>
            <ListIcon />
          </IconButton>
        </Stack>
      </Stack>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
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
        <MenuItem onClick={handleNewTimeEntry}>New time entry</MenuItem>
      </Menu>
    </Box>
  );
}
