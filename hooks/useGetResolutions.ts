import { getLegacyResolutionsQuery } from "@graphql/subgraph/queries/get-legacy-resolutions-query";
import { getResolutionsQuery } from "@graphql/subgraph/queries/get-resolutions-query";
import { useLegacySubgraphGraphQL, useSubgraphGraphQL } from "@graphql/subgraph/subgraph-client";

const REFRESH_EVERY_MS = 3000;

export default function useGetResolutions() {
  const { data, isLoading, error } = useSubgraphGraphQL(getResolutionsQuery, {
    refreshInterval: REFRESH_EVERY_MS,
  });

  const { data: legacyResolutionsData, isLoading: isLoadingLegacyFetcher } = useLegacySubgraphGraphQL(
    getLegacyResolutionsQuery,
    {
      refreshInterval: REFRESH_EVERY_MS,
    },
  );

  return {
    resolutions: [
      ...(data?.resolutions || []),
      ...(legacyResolutionsData?.resolutions || []).map((res) => ({ ...res, isLegacy: true })),
    ],
    isLoading: isLoading || isLoadingLegacyFetcher,
    error,
  };
}
