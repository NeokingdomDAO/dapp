import { shallow } from "zustand/shallow";

import { Box, Button, Divider, Stack } from "@mui/material";

import useTimeEntryStore from "@store/timeEntry";

import Modal from "@components/Modal";

import TimeEntryForm from "./Form";

export default function StopModal() {
  const { reset, showStopModal, resume } = useTimeEntryStore(
    (state) => ({
      reset: state.reset,
      resume: state.resume,
      showStopModal: state.showStopModal,
    }),
    shallow,
  );

  if (!showStopModal) return null;

  return (
    <Modal
      open={showStopModal}
      hasCloseButton={false}
      sx={{ bgcolor: (t) => (t.palette.mode === "dark" ? "#1A1A1A" : "#FAFAFA") }}
    >
      <>
        <TimeEntryForm />
        <Divider sx={{ mt: 3 }} />
        <Box mt={2}>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Button variant="outlined" onClick={resume} size="small">
              Continue tracking
            </Button>
            <Button variant="outlined" onClick={reset} size="small">
              Discard entry
            </Button>
          </Stack>
        </Box>
      </>
    </Modal>
  );
}
