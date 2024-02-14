import { getLegacyResolutionsQuery } from "@graphql/queries/subgraph/get-legacy-resolutions-query";
import { getResolutionsQuery } from "@graphql/queries/subgraph/get-resolutions-query";
import { useLegacySubgraphGraphQL, useSubgraphGraphQL } from "@graphql/subgraph";

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
