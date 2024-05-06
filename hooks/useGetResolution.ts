import { useRouter } from "next/router";
import useSWR from "swr";
import { ResolutionEntity } from "types";

import { getLegacyResolutionQuery } from "@graphql/subgraph/queries/get-legacy-resolution-query";
import { getResolutionQuery } from "@graphql/subgraph/queries/get-resolution-query";
import { useLegacySubgraphGraphQL, useSubgraphGraphQL } from "@graphql/subgraph/subgraph-client";

import { fetcher } from "@lib/net";

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

  const { data: legacyResolutionData, isLoading: isLoadingLegacyResolution } = useLegacySubgraphGraphQL(
    router?.query?.id ? getLegacyResolutionQuery : null,
    {
      refreshInterval: REFRESH_INTERVAL_MS,
    },
    [{ id: router.query.id as string }],
  );

  const { data: dbResolution, isLoading: isLoadingDbResolution } = useSWR<{ title: string; content: string }>(
    resolutionData?.resolution || legacyResolutionData?.resolution
      ? `/api/resolutions/${resolutionData?.resolution?.ipfsDataURI || legacyResolutionData?.resolution?.ipfsDataURI}`
      : null,
    fetcher,
  );

  const resolution =
    resolutionData?.resolution ||
    (legacyResolutionData?.resolution ? { ...legacyResolutionData.resolution, isLegacy: true } : null);

  return {
    resolution: dbResolution ? { ...resolution, title: dbResolution.title, content: dbResolution.content } : resolution,
    isLoading: isLoadingResolution || isLoadingLegacyResolution || isLoadingDbResolution,
  };
}
