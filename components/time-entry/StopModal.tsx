import { format } from "date-fns";
import { shallow } from "zustand/shallow";

import { Alert, Box, Button, Divider, Stack } from "@mui/material";

import useTimeEntryStore from "@store/timeEntry";

import Modal from "@components/Modal";

export default function StopModal() {
  const { startAt, stopAt, reset, showStopModal, resume } = useTimeEntryStore(
    (state) => ({
      startAt: state.startAt,
      stopAt: state.stopAt,
      reset: state.reset,
      resume: state.resume,
      showStopModal: state.showStopModal,
    }),
    shallow,
  );

  const isLessThanOneMinuteElapsed = startAt && stopAt && stopAt.getTime() - startAt.getTime() < 60000;

  if (!showStopModal) return null;

  return (
    <Modal onClose={reset} open={showStopModal} hasCloseButton={false}>
      <>
        {isLessThanOneMinuteElapsed ? (
          <Alert severity="warning">You can&apos;t log less than one minute.</Alert>
        ) : (
          <Box p={2}>
            {startAt && <p>Start time {format(startAt, "yyyy-MM-dd HH:mm:ss")}</p>}
            {stopAt && <p>Start time {format(stopAt, "yyyy-MM-dd HH:mm:ss")}</p>}
          </Box>
        )}
        <Box mt={3}>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={2}
            justifyContent="flex-end"
            alignItems="center"
          >
            <Button variant="contained" onClick={resume}>
              Continue tracking
            </Button>
            <Button variant="contained" onClick={reset}>
              Discard entry
            </Button>
            {!isLessThanOneMinuteElapsed && (
              <Button variant="contained" onClick={reset}>
                Save entry
              </Button>
            )}
          </Stack>
        </Box>
      </>
    </Modal>
  );
}
