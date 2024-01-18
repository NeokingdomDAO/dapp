import { useState } from "react";

import { Alert, Box, Button, CircularProgress, Paper, Typography } from "@mui/material";

import { getRelativeDateFromUnixTimestamp } from "@lib/resolutions/common";
import { TOKEN_SYMBOL } from "@lib/utils";

import Modal from "@components/Modal";

import { bigIntToNum } from "@hooks/useUserBalanceAndOffers";
import useUserRedemption from "@hooks/useUserRedemption";

import RedeemTokens from "./RedeemTokens";

export default function Redemption() {
  const { data, isLoading, error } = useUserRedemption();

  const [redeemModalMax, setRedeemModalMax] = useState(0);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!error && data?.length === 0) {
    return <Alert severity="info">You have no pending redemptions</Alert>;
  }

  return (
    <>
      {redeemModalMax > 0 && (
        <Modal open onClose={() => setRedeemModalMax(0)} size="medium">
          <RedeemTokens closeModal={() => setRedeemModalMax(0)} maxToRedeem={redeemModalMax} />
        </Modal>
      )}
      {data?.map((redemption) => (
        <Paper sx={{ display: "flex", justifyContent: "space-between", p: 2, mb: 1 }} key={redemption.id}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h5">
              {bigIntToNum(redemption.amount)} {TOKEN_SYMBOL}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Redeemable on: {getRelativeDateFromUnixTimestamp(redemption.endTimestamp, true)}
            </Typography>
            {redemption.redemptionHistory.length > 0 && (
              <>
                <Typography>History</Typography>
                <ul>
                  {redemption.redemptionHistory.map((history) => (
                    <li key={history.id}>
                      ✅ {history.amount} {TOKEN_SYMBOL} redeemed on{" "}
                      {getRelativeDateFromUnixTimestamp(history.timestamp, true)}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => setRedeemModalMax(bigIntToNum(redemption.amount))}
            >
              Redeem
            </Button>
          </Box>
        </Paper>
      ))}
    </>
  );
}
