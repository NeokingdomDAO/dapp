import useSWR from "swr";
import { useAccount } from "wagmi";

import { Box, CircularProgress, Divider, Grid, Paper, SxProps, Typography } from "@mui/material";

import { fetcher } from "@graphql/client";
import { getDaoManagerQuery } from "@graphql/queries/get-dao-manager.query";

import useUserBalanceAndOffers, { bigIntToNum } from "@hooks/useUserBalanceAndOffers";

import DepositTokens from "./DepositTokens";
import OfferTokens from "./OfferTokens";
import WithdrawTokens from "./WithdrawTokens";

const paperSx = {
  p: 4,
  textAlign: "center",
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default function UserActions() {
  const { data, isLoading } = useUserBalanceAndOffers();
  const { data: daoManagerData, isLoading: isLoadingDaoManagerData } = useSWR<any>(getDaoManagerQuery, fetcher);
  const { address } = useAccount();

  const loading = isLoading || isLoadingDaoManagerData;

  if (loading) {
    return <CircularProgress />;
  }

  const isInvestor = daoManagerData?.daoManager?.investorsAddresses?.includes(address?.toLowerCase());
  const withdrawableBalance = isInvestor
    ? (data?.balance.governanceTokens || 0) - (data?.balance.vestingTokens || 0)
    : data?.balance.unlockedTokens;

  return (
    <>
      <Grid container spacing={2}>
        {!isInvestor && (
          <Grid item xs={12} md={6} lg={4}>
            <Paper sx={paperSx}>
              <div>
                <Typography variant="h5">Locked: {data?.balance.lockedTokens}</Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Offered: {data?.balance.offeredTokens}
                </Typography>
                <OfferTokens />
              </div>
            </Paper>
          </Grid>
        )}
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={paperSx}>
            <div>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Unlocked: {withdrawableBalance}
              </Typography>
              <WithdrawTokens withdrawableBalance={withdrawableBalance || 0} />
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={paperSx}>
            <div>
              <Typography variant="h5" sx={{ mb: 2 }}>
                NEOK Balance: {data?.balance.neokTokens}
              </Typography>
              <DepositTokens />
            </div>
          </Paper>
        </Grid>
      </Grid>
      {(data?.balance?.vestingTokens || 0) > 0 && (
        <>
          <Divider sx={{ mt: 4, mb: 4 }} />
          <Paper sx={paperSx}>
            <Typography variant="h5">Vesting: {data?.balance.vestingTokens}</Typography>
          </Paper>
        </>
      )}
    </>
  );
}
