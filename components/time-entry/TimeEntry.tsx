import { useRouter } from "next/router";
import { shallow } from "zustand/shallow";

import { useEffect, useState } from "react";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { Divider, IconButton, Paper, Stack, SxProps, Theme, Typography, keyframes, useMediaQuery } from "@mui/material";

import useTimeEntryStore from "@store/timeEntry";

import useUserProjects from "@hooks/useUserProjects";

import ElapsedTime from "./ElapsedTime";
import StopModal from "./StopModal";

const rotateAnimation = keyframes`
100% {
  transform: rotate(1turn);
}
`;

const activeSx: SxProps<Theme> = {
  overflow: "hidden",
  "&:before": {
    content: '""',
    position: "absolute",
    zIndex: -2,
    left: "-50px",
    top: "-150px",
    width: "400px",
    height: "400px",
    bgcolor: (t) => (t.palette.mode === "dark" ? "#1F1F1F" : "#EEE"),
    backgroundRepeat: "no-repeat",
    backgroundSize: "50% 50%",
    backgroundPosition: "0 0",
    backgroundImage: (t) => `linear-gradient(${t.palette.success.light}, ${t.palette.success.dark})`,
    animation: `${rotateAnimation} 3s linear infinite`,
  },
  "&:after": {
    content: '""',
    position: "absolute",
    zIndex: -1,
    left: 3,
    top: 3,
    width: "calc(100% - 6px)",
    height: "calc(100% - 6px)",
    bgcolor: (t) => (t.palette.mode === "dark" ? "#222" : "#FAFAFA"),
    borderRadius: "5px",
  },
};

export default function TimeEntry() {
  const { userTasks, isLoading } = useUserProjects();
  const { startAt, stopAt, start, stop, showStopModal, taskId } = useTimeEntryStore(
    (state) => ({
      startAt: state.startAt,
      stopAt: state.stopAt,
      start: state.start,
      stop: state.stop,
      taskId: state.taskId,
      showStopModal: state.showStopModal,
    }),
    shallow,
  );

  const currentTask = !isLoading ? userTasks?.find((ut) => ut.id === taskId) : null;

  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (startAt && !showStopModal) {
      const intervalCallback = () => {
        const now = Date.now();
        const timeDiff = Math.round((now - startAt) / 1000);
        setElapsedTime(timeDiff);
      };
      const interval = setInterval(intervalCallback, 1000);
      intervalCallback();
      return () => {
        clearInterval(interval);
        setElapsedTime(0);
      };
    }
  }, [startAt, showStopModal, setElapsedTime]);

  const isActive = startAt && !stopAt;
  const shouldNotDisplayStart = !isActive && showStopModal;

  if (shouldNotDisplayStart) {
    return <StopModal />;
  }

  return (
    <>
      <StopModal />
      <Paper
        sx={{
          p: 0.8,
          pl: 1.5,
          pr: 1.5,
          position: "fixed",
          zIndex: 1001,
          bottom: 16,
          right: 16,
          bgcolor: (t) => (t.palette.mode === "dark" ? "#222" : "#FAFAFA"),
          ...(isActive ? activeSx : {}),
        }}
        elevation={12}
      >
        {taskId && startAt && !showStopModal && currentTask && (
          <>
            <Typography sx={{ mb: 1 }} variant="body2">
              {currentTask.name}
            </Typography>
          </>
        )}
        {isActive ? (
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <ElapsedTime elapsedTime={elapsedTime} size="small" />
            <IconButton
              aria-label="stop"
              color="primary"
              sx={{ position: "relative", zIndex: 2, border: "1px solid", borderColor: "divider" }}
              size="small"
              onClick={stop}
            >
              <StopCircleIcon />
            </IconButton>
          </Stack>
        ) : (
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="body1">Start tracking</Typography>
            <IconButton
              aria-label="start"
              color="primary"
              onClick={start}
              sx={{ border: "1px solid", borderColor: "divider" }}
              size="small"
            >
              <PlayArrowIcon />
            </IconButton>
          </Stack>
        )}
      </Paper>
    </>
  );
}
