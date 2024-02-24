import { ReactEventHandler, SyntheticEvent, useCallback, useEffect, useMemo, useState } from "react";

import { AccessAlarm, CheckCircleRounded, PlayArrow, Stop } from "@mui/icons-material";
import { Box, Chip, CircularProgress, IconButton, keyframes, useTheme } from "@mui/material";

import { getStageId } from "@lib/constants";
import { findActiveTimesheet, getTaskName, toPrettyDuration } from "@lib/utils";

import useDialogStore from "@store/dialogStore";
import useProjectTaskStore, { ProjectTask, useProjectTaskActions } from "@store/projectTaskStore";

import useErrorHandler from "@hooks/useErrorHandler";
import useStopwatch from "@hooks/useStopwatch";

const blink = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export default function StopwatchSlim({
  task,
  className,
  onClick,
}: {
  className?: string;
  task: ProjectTask;
  onClick?: ReactEventHandler;
}) {
  const theme = useTheme();

  const { handleError } = useErrorHandler();
  const [isPlaying, setIsPlaying] = useState(false);
  // @ts-expect-error Property 'trackedTask' does not exist on type 'ProjectTaskStore'.
  const trackedTask = useProjectTaskStore((state) => state.trackedTask);
  // @ts-expect-error Property 'isLoading' does not exist on type 'ProjectTaskStore'.
  const isLoading = useProjectTaskStore((state) => state.isLoading);
  const actions = useProjectTaskActions();
  // @ts-expect-error Property 'startTrackingTask' does not exist on type
  const startTrackingTask = handleError(actions.startTrackingTask);
  // @ts-expect-error Property 'stopTrackingTask' does not exist on type
  const stopTrackingTask = handleError(actions.stopTrackingTask);

  const openDialog = useDialogStore(({ openDialog }) => openDialog);
  const closeDialog = useDialogStore(({ closeDialog }) => closeDialog);

  const offsetTimestamp = useMemo(() => {
    const activeTimesheet = findActiveTimesheet(task);
    return activeTimesheet ? new Date(activeTimesheet.start * 1000).getTime() : 0;
  }, [task]);

  const {
    seconds,
    minutes,
    hours,
    isRunning,
    start: startTime,
    pause: pauseTime,
    reset: resetTime,
  } = useStopwatch({ offsetTimestamp });

  const isTrackingTask = useCallback((task: ProjectTask) => trackedTask && trackedTask.id === task.id, [trackedTask]);

  useEffect(() => {
    if (isTrackingTask(task)) {
      setIsPlaying(true);
      !isRunning && startTime();
    } else {
      setIsPlaying(false);
    }
  }, [trackedTask, task, isRunning, startTime, isTrackingTask]);

  const stopwatchCounter = () => {
    const hh = hours.toString().padStart(2, "0");
    const mm = minutes.toString().padStart(2, "0");
    const ss = seconds.toString().padStart(2, "0");
    return <Box sx={{ minWidth: "60px" }}>{`${hh}:${mm}:${ss}`}</Box>;
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
        onCancel: () => closeDialog(),
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

  const isDone = task.stage_id.id === getStageId("done");

  const renderTaskAction = () => {
    if (isLoading && isTrackingTask(task)) {
      return (
        <IconButton sx={{ padding: 0 }}>
          <CircularProgress size={30} />
        </IconButton>
      );
    }
    if (isDone) {
      return (
        <IconButton sx={{ padding: 0 }}>
          <CheckCircleRounded color="success" sx={{ fontSize: 30 }} />
        </IconButton>
      );
    }
    if (isPlaying) {
      return (
        <IconButton sx={{ padding: 0 }} onClick={handleStopTask}>
          <Stop color="primary" sx={{ fontSize: 30 }} />
        </IconButton>
      );
    }
    return (
      <IconButton sx={{ padding: 0 }} onClick={handleStartTask}>
        <PlayArrow sx={{ fontSize: 30 }} />
      </IconButton>
    );
  };

  return (
    <Box className={className} sx={{ position: "relative" }}>
      <Box
        className="stopwatch-"
        sx={{
          position: "absolute",
          left: "-2px",
          top: 0,
          zIndex: 1,
          background: theme.palette.background.paper,
          border: `1px solid ${isDone ? theme.palette.success.main : theme.palette.grey[400]}`,
          borderRadius: "50%",
        }}
      >
        {renderTaskAction()}
      </Box>
      <Chip
        className="stopwatch-chip"
        icon={<PlayArrow />}
        color={isDone ? "success" : undefined}
        variant="outlined"
        onClick={(e: SyntheticEvent) => {
          e.preventDefault();
          e.stopPropagation();
          onClick && onClick(e);
        }}
        sx={{
          "& .MuiChip-deleteIcon": {
            color: theme.palette.error.main,
            animation: `${blink} 1.5s linear infinite`,
          },
        }}
        onDelete={isPlaying ? () => null : undefined}
        deleteIcon={isPlaying ? <AccessAlarm /> : undefined}
        label={isPlaying ? stopwatchCounter() : toPrettyDuration(task.effective_hours)}
      />
    </Box>
  );
}
