import useSWR from "swr";

import { Box, Divider, Typography } from "@mui/material";

import { getDaoManagerQuery } from "@graphql/subgraph/queries/get-dao-manager-query";
import { useSubgraphGraphQL } from "@graphql/subgraph/subgraph-client";

import UserBalance from "@components/tokens/UserBalance";

import useUserBalanceAndOffers, { bigIntToNum } from "@hooks/useUserBalanceAndOffers";

export default function Tokens() {
  const { data, error } = useUserBalanceAndOffers();
  const { data: daoManagerData } = useSubgraphGraphQL(getDaoManagerQuery);

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
