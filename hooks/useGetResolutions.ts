import { getLegacyResolutionsQuery } from "@graphql/queries/subgraph/get-legacy-resolutions-query";
import { getResolutionsQuery } from "@graphql/queries/subgraph/get-resolutions-query";
import { useGraphQL, useLegacyGraphQL } from "@graphql/useGraphql";

const REFRESH_EVERY_MS = 3000;

export default function useGetResolutions() {
  const { data, isLoading, error } = useGraphQL(getResolutionsQuery, {
    refreshInterval: REFRESH_EVERY_MS,
  });

  const { data: legacyResolutionsData, isLoading: isLoadingLegacyFetcher } = useLegacyGraphQL(
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
