import { Alert, LinearProgress, Slide, SlideProps, Snackbar, Typography } from "@mui/material";

import { useCheckSubgraphState } from "@hooks/useCheckSubgraphState";

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

export default function MismatchNotifier() {
  const { difference, shouldNotifyMismatch } = useCheckSubgraphState();
  return (
    <Snackbar
      open={shouldNotifyMismatch}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      TransitionComponent={SlideTransition}
    >
      <Alert severity="warning" sx={{ width: "100%" }}>
        <LinearProgress sx={{ mb: 1 }} />
        <Typography variant="body2">Blockchain sync in progress</Typography>
        <Typography variant="caption">{difference} blocks mismatch</Typography>
      </Alert>
    </Snackbar>
  );
}
