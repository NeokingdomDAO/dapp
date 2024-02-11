import { useRouter } from "next/router";

import { getLegacyResolutionQuery } from "@graphql/queries/subgraph/get-legacy-resolution-query";
import { getResolutionQuery } from "@graphql/queries/subgraph/get-resolution-query";
import { useGraphQL, useLegacyGraphQL } from "@graphql/useGraphql";

const REFRESH_INTERVAL_MS = 5000;

export default function useGetResolution() {
  const router = useRouter();

  const { data: resolutionData, isLoading: isLoadingResolution } = useGraphQL(
    router?.query?.id ? getResolutionQuery : null,
    {
      refreshInterval: REFRESH_INTERVAL_MS,
    },
    [{ id: router.query.id as string }],
  );

  const { data: legacyResolutionData, isLoading: isLoadingLegacyResolution } = useLegacyGraphQL(
    router?.query?.id ? getLegacyResolutionQuery : null,
    {
      refreshInterval: REFRESH_INTERVAL_MS,
    },
    [{ id: router.query.id as string }],
  );

  return {
    resolution:
      resolutionData?.resolution ||
      (legacyResolutionData?.resolution ? { ...legacyResolutionData.resolution, isLegacy: true } : null),
    isLoading: isLoadingResolution || isLoadingLegacyResolution,
  };
}
