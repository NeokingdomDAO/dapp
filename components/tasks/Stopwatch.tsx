import { ReactEventHandler, SyntheticEvent, useEffect, useState } from "react";

import { AccessAlarm, CheckCircleRounded, PlayArrow, Stop } from "@mui/icons-material";
import { Box, Chip, keyframes, useTheme } from "@mui/material";

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
  const trackedTask = useProjectTaskStore((state) => state.trackedTask);
  const actions = useProjectTaskActions();
  const startTrackingTask = handleError(actions.startTrackingTask);
  const stopTrackingTask = handleError(actions.stopTrackingTask);

  const openDialog = useDialogStore(({ openDialog }) => openDialog);
  const closeDialog = useDialogStore(({ closeDialog }) => closeDialog);

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

  const isDone = task.stage_id.id === STAGE_TO_ID_MAP["done"];

  const renderTaskAction = () => {
    if (isDone) {
      return <CheckCircleRounded color="success" />;
    }
    if (isPlaying) {
      return <Stop color="primary" onClick={handleStopTask} />;
    }
    return <PlayArrow onClick={handleStartTask} />;
  };

  return (
    <Chip
      className={className}
      icon={renderTaskAction()}
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
  );
}
