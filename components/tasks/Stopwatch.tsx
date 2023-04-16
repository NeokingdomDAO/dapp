import { useEffect, useState } from "react";

import { AccessAlarm, CheckCircleRounded, PlayArrow, Stop } from "@mui/icons-material";
import { Box, IconButton, keyframes, useTheme } from "@mui/material";

import { STAGE_TO_ID_MAP } from "@lib/constants";
import { getTaskName, toPrettyDuration } from "@lib/utils";

import useDialogStore from "@store/dialogStore";
import useProjectTaskStore, { ProjectTask, useProjectTaskActions } from "@store/projectTaskStore";

import useErrorHandler from "@hooks/useErrorHandler";
import useStopwatch from "@hooks/useStopwatch";

const blink = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export default function Stopwatch({ task }: { task: ProjectTask }) {
  const theme = useTheme();

  const { handleError } = useErrorHandler();
  const [isPlaying, setIsPlaying] = useState(false);
  const trackedTask = useProjectTaskStore((state) => state.trackedTask);
  const actions = useProjectTaskActions();
  const startTrackingTask = handleError(actions.startTrackingTask);
  const stopTrackingTask = handleError(actions.stopTrackingTask);

  const openDialog = useDialogStore(({ openDialog }) => openDialog);

  const { seconds, minutes, hours, isRunning, start: startTime, pause: pauseTime, reset: resetTime } = useStopwatch({});

  const isTrackingTask = (task: ProjectTask) => trackedTask && trackedTask.id === task.id;

  useEffect(() => {
    if (isTrackingTask(task)) {
      setIsPlaying(true);
      !isRunning && startTime();
    } else {
      setIsPlaying(false);
    }
  }, [trackedTask, task]);

  const stopwatchCounter = () => {
    const hh = hours.toString().padStart(2, "0");
    const mm = minutes.toString().padStart(2, "0");
    const ss = seconds.toString().padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  };

  const handleStartTask = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    resetTime(0, false);
    if (trackedTask) {
      openDialog({
        open: true,
        message: (
          <span>
            You are already tracking <strong>{getTaskName(trackedTask)}</strong>, do you want to switch to{" "}
            <strong> {getTaskName(task)}</strong> instead?
          </span>
        ),
        onConfirm: async () => {
          await stopTrackingTask(trackedTask);
          await startTrackingTask(task);
          startTime();
        },
      });
    } else {
      startTime();
      startTrackingTask(task);
    }
  };

  const handleStopTask = (event: React.SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    stopTrackingTask(task);
    pauseTime();
  };

  const renderTaskAction = () => {
    const isDone = task.stage_id.id === STAGE_TO_ID_MAP["done"];
    if (isDone) {
      return (
        <IconButton sx={{ padding: 0 }} color="success">
          <CheckCircleRounded fontSize="large" />
        </IconButton>
      );
    }
    if (isPlaying) {
      return (
        <IconButton sx={{ padding: 0, border: `1px solid ${theme.palette.primary.main}` }} onClick={handleStopTask}>
          <Stop sx={{ fontSize: 30 }} color="primary" />
        </IconButton>
      );
    }
    return (
      <IconButton sx={{ padding: 0, border: `1px solid ${theme.palette.grey[300]}` }} onClick={handleStartTask}>
        <PlayArrow sx={{ fontSize: 30 }} />
      </IconButton>
    );
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          lineHeight: 1,
          borderRadius: "3px",
          padding: "2px",
          border: `1px solid ${theme.palette.divider}`,
          minWidth: "109px",
          "&:hover": {
            cursor: "pointer",
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <AccessAlarm
          sx={{
            color: isPlaying ? theme.palette.error.main : theme.palette.text.primary,
            animation: isPlaying ? `${blink} 1.5s linear infinite` : "none",
          }}
          fontSize="small"
        />
        <Box sx={{ pl: "2px", pr: "5px" }}>
          {isPlaying ? stopwatchCounter() : toPrettyDuration(task.effective_hours)}
        </Box>
        <Box
          sx={{
            position: "absolute",
            right: "-22px",
            top: "-3px",
            background: theme.palette.background.paper,
            borderRadius: "50%",
          }}
        >
          {renderTaskAction()}
        </Box>
      </Box>
    </Box>
  );
}
