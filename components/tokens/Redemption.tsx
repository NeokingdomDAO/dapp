import { useState } from "react";

import { Alert, Box, Button, CircularProgress, Paper, Typography } from "@mui/material";

import { getRelativeDateFromUnixTimestamp } from "@lib/resolutions/common";
import { TOKEN_SYMBOL } from "@lib/utils";

import Modal from "@components/Modal";

import useUserBalanceAndOffers, { bigIntToNum } from "@hooks/useUserBalanceAndOffers";
import useUserRedemption from "@hooks/useUserRedemption";

import RedeemTokens from "./RedeemTokens";

export default function Redemption() {
  const { data, isLoading, error } = useUserRedemption();
  const { data: userBalanceData } = useUserBalanceAndOffers();

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
      {data?.map((redemption) => {
        const finalAmount =
          bigIntToNum(redemption.amount) -
          redemption.redemptionHistory.reduce((sum, history) => sum + bigIntToNum(history.amount), 0);
        const maxToRedeem = Math.min(
          finalAmount,
          (userBalanceData?.balance.governanceTokens || 0) + (userBalanceData?.balance.unlockedTokens || 0),
        );
        const canBeRedeemed =
          maxToRedeem > 0 &&
          Number(redemption.startTimestamp) <= Date.now() / 1000 &&
          Number(redemption.endTimestamp) > Date.now() / 1000;
        return (
          <Paper sx={{ display: "flex", justifyContent: "space-between", p: 2, mb: 1 }} key={redemption.id}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="h5">
                {maxToRedeem} {TOKEN_SYMBOL}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Redeemable from <b>{getRelativeDateFromUnixTimestamp(redemption.startTimestamp, true)}</b> until{" "}
                <b>{getRelativeDateFromUnixTimestamp(redemption.endTimestamp, true)}</b>
              </Typography>
              {redemption.redemptionHistory.length > 0 && (
                <>
                  <Typography sx={{ mt: 2 }} variant="h6">
                    History
                  </Typography>
                  <Box component="ul" sx={{ m: 0, p: 0 }}>
                    {redemption.redemptionHistory.map((history) => (
                      <Box component="li" key={history.id} sx={{ pl: 2, listStyle: "none" }}>
                        <Box component="span" sx={{ mr: 1 }}>
                          ✅
                        </Box>{" "}
                        <b>
                          {bigIntToNum(history.amount)} {TOKEN_SYMBOL}
                        </b>{" "}
                        redeemed on <b>{getRelativeDateFromUnixTimestamp(history.timestamp, true)}</b>
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => setRedeemModalMax(maxToRedeem)}
                disabled={!canBeRedeemed}
              >
                Redeem
              </Button>
            </Box>
          </Paper>
        );
      })}
    </>
  );
}
