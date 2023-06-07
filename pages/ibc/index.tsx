import { useKeplrContext } from "contexts/KeplrContext";

import { Button, Grid, Paper, Typography } from "@mui/material";

import IBCBalance from "@components/ibc/IBCBalance";

export default function IBC() {
  const { connect, hasKeplr, isConnected } = useKeplrContext();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12} lg={12}>
        <Paper sx={paperSx}>
          <div>
            <Typography variant="h5" sx={{ mb: 2 }}>
              NEOKingdom DAO IBC tools
            </Typography>
            {hasKeplr ? (
              <Button variant="contained" color="primary" onClick={() => connect()}>
                Connect Keplr
              </Button>
            ) : (
              <Button href="https://www.keplr.app/">Install Keplr wallet</Button>
            )}
          </div>
        </Paper>
      </Grid>

      {isConnected && (
        <>
          <Grid item xs={12} md={12} lg={12}>
            <Paper sx={paperSx}>
              <IBCBalance chain="evmos" />
            </Paper>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Paper sx={paperSx}>
              <IBCBalance chain="crescent" />
            </Paper>
          </Grid>
        </>
      )}
    </Grid>
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
