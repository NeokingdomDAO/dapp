import { useRouter } from "next/router";
import useSWR from "swr";

import { useMemo } from "react";

import { getResolutionQuery } from "@graphql/subgraph/queries/get-resolution-query";
import { useSubgraphGraphQL } from "@graphql/subgraph/subgraph-client";

import { fetcher } from "@lib/net";
import isCorrupted from "@lib/resolutions/corruption-check";

const REFRESH_INTERVAL_MS = 5000;

export default function useGetResolution() {
  const router = useRouter();

  const { data: resolutionData, isLoading: isLoadingResolution } = useSubgraphGraphQL(
    router?.query?.id ? getResolutionQuery : null,
    {
      refreshInterval: REFRESH_INTERVAL_MS,
    },
    [{ id: router.query.id as string }],
  );

  const { data: dbResolution, isLoading: isLoadingDbResolution } = useSWR<{
    title: string;
    content: string;
    hash: string;
    isRewards: boolean;
  }>(resolutionData?.resolution ? `/api/resolutions/${resolutionData?.resolution?.hash}` : null, fetcher);

  const showCorruptionAlert = useMemo(() => {
    if (!dbResolution) {
      return false;
    }

    return isCorrupted(dbResolution.hash, dbResolution);
  }, [dbResolution]);

  return {
    resolution: dbResolution
      ? { ...resolutionData?.resolution, title: dbResolution.title, content: dbResolution.content }
      : resolutionData?.resolution,
    isLoading: isLoadingResolution || isLoadingDbResolution,
    showCorruptionAlert,
  };
}
