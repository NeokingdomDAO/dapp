import { GetUserRedemptionQuery } from "gql/graphql";
import { useAccount } from "wagmi";

import { useMemo } from "react";

import { getUserRedemption } from "@graphql/queries/subgraph/get-user-redemption";
import { useGraphQL } from "@graphql/useGraphql";

import { bigIntToBigNum } from "./useUserBalanceAndOffers";

const REFRESH_EVERY_MS = 1000 * 5;

type Redemption = GetUserRedemptionQuery["redemptions"]["0"];

export default function useUserRedemption(): {
  data: Redemption[] | null;
  error: any;
  isLoading: boolean;
} {
  const { address: userId } = useAccount();
  const { data, error, isLoading } = useGraphQL(
    userId ? getUserRedemption : null,
    {
      refreshInterval: REFRESH_EVERY_MS,
    },
    [{ userId: userId?.toLowerCase() }],
  );

  const redemptions = useMemo(() => {
    if (!data) return null;

    return data.redemptions.reduce((acc: Redemption[], redemption) => {
      const existingRedemption = acc.find(
        (existing) =>
          existing.startTimestamp === redemption.startTimestamp && existing.endTimestamp === redemption.endTimestamp,
      );
      if (existingRedemption) {
        existingRedemption.amount = bigIntToBigNum(existingRedemption.amount)
          .add(bigIntToBigNum(redemption.amount))
          .toBigInt();
        existingRedemption.redemptionHistory.push(...redemption.redemptionHistory);
      } else {
        acc.push({ ...redemption });
      }
      return acc;
    }, []);
  }, [data]);

  if (redemptions && !isLoading && !error) {
    return {
      data: redemptions,
      isLoading,
      error: null,
    };
  }

  return {
    data: null,
    isLoading,
    error,
  };
}
