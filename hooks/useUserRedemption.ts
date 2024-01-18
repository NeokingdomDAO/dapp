import useSWR from "swr";
import { Redemption } from "types";
import { useAccount } from "wagmi";

import { fetcherWithParams } from "@graphql/client";
import { getUserRedemption } from "@graphql/queries/get-user-redemption";

const REFRESH_EVERY_MS = 1000 * 5;

export default function useUserRedemption(): {
  data: Redemption[] | null;
  error: any;
  isLoading: boolean;
} {
  const { address: userId } = useAccount();
  const { data, error, isLoading } = useSWR<any>(
    userId ? [getUserRedemption, { userId: userId.toLowerCase() }] : null,
    fetcherWithParams,
    {
      refreshInterval: REFRESH_EVERY_MS,
    },
  );

  if (data && !isLoading && !error) {
    return {
      data: data.redemptions,
      isLoading,
      error: null,
    };
  }

  return {
    data,
    isLoading,
    error,
  };
}
