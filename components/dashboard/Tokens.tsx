import useSWR from "swr";
import { useAccount } from "wagmi";

import { Box, Divider, Typography } from "@mui/material";

import { fetcher } from "@graphql/client";
import { getDaoManagerQuery } from "@graphql/queries/get-dao-manager.query";

import UserBalance from "@components/tokens/UserBalance";

import useUserBalanceAndOffers, { bigIntToNum } from "@hooks/useUserBalanceAndOffers";

export default function Tokens() {
  const { data } = useUserBalanceAndOffers();
  const { data: daoManagerData } = useSWR<any>(getDaoManagerQuery, fetcher);

  const totalVotingPower = bigIntToNum(daoManagerData?.daoManager?.totalVotingPower || BigInt(0));
  const userVotingPower = ((100 * (data?.balance?.votingPower || 0)) / totalVotingPower).toFixed(2);

  return (
    <>
      <Typography sx={{ mb: 4 }} variant="h4">
        Your tokens
      </Typography>
      <UserBalance />
      <Divider sx={{ mt: 2 }} />
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography sx={{ mb: 4 }} variant="h4">
          Your voting Power: {userVotingPower}%
        </Typography>
      </Box>
    </>
  );
}
