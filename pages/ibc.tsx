import { useKeplrContext } from "contexts/KeplrContext";

import { Alert, Button, Grid, Paper } from "@mui/material";

import IBCBalance from "@components/ibc/IBCBalance";

export default function IBC() {
  const { networks, hasKeplr, connect, disconnect } = useKeplrContext();

  if (!hasKeplr)
    return (
      <Alert
        severity="warning"
        action={
          <Button size="small" variant="outlined" href="https://www.keplr.app/" target="_blank">
            Install Keplr
          </Button>
        }
      >
        It looks you don&apos;t have the Kepr wallet installed. Please install it to use this feature.
      </Alert>
    );

  const connectKeplr = () => {
    if (typeof connect === "function") {
      connect("crescent");
      connect("evmos");
    }
  };

  if (!networks?.["evmos"]?.address && !networks?.["crescent"]?.address) {
    return (
      <Alert
        severity="info"
        action={
          <Button size="small" variant="outlined" onClick={connectKeplr}>
            Connect Keplr
          </Button>
        }
        sx={{ mb: 2 }}
      >
        Please connect your Keplr wallet
      </Alert>
    );
  }

  return (
    <>
      {networks?.["evmos"]?.address && networks?.["crescent"]?.address && (
        <Alert
          severity="info"
          action={
            <Button size="small" variant="outlined" onClick={() => typeof disconnect === "function" && disconnect()}>
              Disconnect Keplr
            </Button>
          }
          sx={{ mb: 2 }}
        >
          You&apos;re now connected to Keplr
        </Alert>
      )}

      <Grid item xs={12} sx={{ mb: 2 }}>
        <Paper sx={paperSx}>
          <IBCBalance chain="evmos" />
        </Paper>
      </Grid>
      <Grid item xs={12} sx={{ mb: 2 }}>
        <Paper sx={paperSx}>
          <IBCBalance chain="crescent" />
        </Paper>
      </Grid>
    </>
  );
}

const paperSx = {
  p: 4,
  textAlign: "center",
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
