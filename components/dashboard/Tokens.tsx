import useSWR from "swr";

import { Box, Divider, Typography } from "@mui/material";

import { getDaoManagerQuery } from "@graphql/queries/subgraph/get-dao-manager-query";
import { useGraphQL } from "@graphql/useGraphql";

import UserBalance from "@components/tokens/UserBalance";

import useUserBalanceAndOffers, { bigIntToNum } from "@hooks/useUserBalanceAndOffers";

export default function Tokens() {
  const { data, error } = useUserBalanceAndOffers();
  const { data: daoManagerData } = useGraphQL(getDaoManagerQuery);

  const totalVotingPower = bigIntToNum(daoManagerData?.daoManager?.totalVotingPower || BigInt(0));
  const userVotingPower = ((100 * (data?.balance?.votingPower || 0)) / totalVotingPower).toFixed(2);

  return (
    <>
      <UserBalance />
      <Divider sx={{ mt: 2 }} />
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography sx={{ mb: 4 }} variant="h4">
          Your voting Power: {error ? "-" : `${userVotingPower}%`}
        </Typography>
      </Box>
    </>
  );
}
