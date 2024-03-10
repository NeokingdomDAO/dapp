import { addDays, differenceInSeconds, format } from "date-fns";

import { useMemo, useState } from "react";

import { Alert, AlertTitle, Box, Button, CircularProgress, Paper, Typography } from "@mui/material";

import { getRelativeDateFromUnixTimestamp } from "@lib/resolutions/common";
import { TOKEN_SYMBOL } from "@lib/utils";

import Countdown from "@components/Countdown";
import Modal from "@components/Modal";

import useTimestamp from "@hooks/useTimestamp";
import useUserBalanceAndOffers, { bigIntToNum } from "@hooks/useUserBalanceAndOffers";
import useUserRedemption from "@hooks/useUserRedemption";

import RedeemTokens from "./RedeemTokens";

const DAYS_FOR_REDEMPTION = 30;
const DAYS_IN_SECONDS = DAYS_FOR_REDEMPTION * 24 * 60 * 60;

export default function Redemption() {
  const { data, isLoading, error } = useUserRedemption();
  const { data: userBalanceData } = useUserBalanceAndOffers();

  const [redeemModalMax, setRedeemModalMax] = useState(0);
  const { currentTimestamp } = useTimestamp();

  const userBalanceTotal =
    (userBalanceData?.balance.governanceTokens || 0) + (userBalanceData?.balance.unlockedTokens || 0);

  const lastRedemptionDate = useMemo(() => {
    if (isLoading || !data) {
      return null;
    }
    const allDates = data
      .map((redemption) => redemption.redemptionHistory.map((h) => Number(h.timestamp) * 1000))
      .flat();

    if (allDates.length === 0) {
      return null;
    }

    // return the most recent date
    return new Date(Math.max(...allDates));
  }, [data, isLoading]);

  const hasRedeemedInLast30Days = useMemo(() => {
    if (!lastRedemptionDate) {
      return false;
    }

    const difference = differenceInSeconds(lastRedemptionDate, currentTimestamp);

    return difference < 0 && difference > -DAYS_IN_SECONDS;
  }, [currentTimestamp, lastRedemptionDate]);

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
          <RedeemTokens maxToRedeem={redeemModalMax} />
        </Modal>
      )}
      {hasRedeemedInLast30Days && lastRedemptionDate && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Your last redemption has been made on <b>{format(lastRedemptionDate, "dd LLL yyyy, H:mm:ss")}</b>.{" "}
          <Countdown
            targetDate={addDays(lastRedemptionDate, DAYS_FOR_REDEMPTION)}
            prefixLabel="You will be able to redeem your tokens again"
            inline
            hideIfPast
          />
        </Alert>
      )}
      {!hasRedeemedInLast30Days && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <AlertTitle>Redeeming Information</AlertTitle>
          Please keep in mind that you can redeem tokens only once per {DAYS_FOR_REDEMPTION} days. <br />
          When you redeem some tokens, this redeeming function will be disabled for the next {
            DAYS_FOR_REDEMPTION
          } days. <br />
          Please pay extra attention to this limitation if you have multiple redeeming options for the next{" "}
          {DAYS_FOR_REDEMPTION} days.
        </Alert>
      )}
      {data?.map((redemption) => {
        const redeemableAmount =
          bigIntToNum(redemption.amount) -
          redemption.redemptionHistory.reduce((sum, history) => sum + bigIntToNum(history.amount), 0);
        const maxToRedeem = Math.min(redeemableAmount, userBalanceTotal);
        const canBeRedeemed =
          !hasRedeemedInLast30Days &&
          maxToRedeem > 0 &&
          Number(redemption.startTimestamp) <= Date.now() / 1000 &&
          Number(redemption.endTimestamp) > Date.now() / 1000;
        return (
          <Paper sx={{ display: "flex", justifyContent: "space-between", p: 2, mb: 1 }} key={redemption.id}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="h5">
                {redeemableAmount} {TOKEN_SYMBOL}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Redeemable from <b>{getRelativeDateFromUnixTimestamp(redemption.startTimestamp, true)}</b> until{" "}
                <b>{getRelativeDateFromUnixTimestamp(redemption.endTimestamp, true)}</b>
              </Typography>
              {userBalanceTotal < redeemableAmount && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  As your balance is less than the redemption amount, the max you can redeem will be capped to your
                  available balance: {userBalanceTotal} {TOKEN_SYMBOL}
                </Alert>
              )}
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
