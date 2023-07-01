import { useKeplrContext } from "contexts/KeplrContext";

import { useState } from "react";

import { Alert, Button, Grid, Paper } from "@mui/material";

import IBCBalanceEvmos from "@components/ibc/IBCBalanceEvmos";

import IBCBalanceCrescent from "../components/ibc/IBCBalanceCrescent";

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

  if (!networks?.evmos?.address && !networks?.crescent?.address) {
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
      {networks?.evmos?.address && networks?.crescent?.address && (
        <Alert
          severity="info"
          action={
            <Button size="small" variant="outlined" onClick={() => typeof disconnect === "function" && disconnect()}>
              Disconnect Keplr
            </Button>
          }
          sx={{ mb: 2 }}
        >
          You&apos;re connected to Keplr
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <IBCBalanceEvmos />
        </Grid>
        <Grid item xs={12} sm={6}>
          <IBCBalanceCrescent />
        </Grid>
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
