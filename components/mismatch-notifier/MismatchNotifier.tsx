import { Alert, Slide, SlideProps, Snackbar } from "@mui/material";

import { useCheckSubgraphState } from "@hooks/useCheckSubgraphState";

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

export default function MismatchNotifier() {
  const { difference, shouldNotifyMismatch } = useCheckSubgraphState();
  return (
    <Snackbar
      open={shouldNotifyMismatch}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      TransitionComponent={SlideTransition}
    >
      <Alert severity="warning" sx={{ width: "100%" }}>
        Dapp data has a mismatch of {difference} blocks with the blockchain. Synchronization in progress, please wait.
        If this persists please contact the engineers via discord.
      </Alert>
    </Snackbar>
  );
}
