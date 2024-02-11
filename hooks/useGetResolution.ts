import { useRouter } from "next/router";
import useSWR from "swr";

import { fetcherWithParams, isLegacyClientEnabled, legacyFetcherWithParams } from "@graphql/client";
import { getLegacyResolutionQuery } from "@graphql/queries/get-legacy-resolution.query";
import { getResolutionQuery } from "@graphql/queries/get-resolution.query";

const REFRESH_INTERVAL_MS = 5000;

export default function useGetResolution() {
  const router = useRouter();

  const { data: resolutionData, isLoading: isLoadingResolution } = useSWR<any>(
    router?.query?.id ? [getResolutionQuery, { id: router.query.id }] : null,
    fetcherWithParams,
    { refreshInterval: REFRESH_INTERVAL_MS },
  );

  const shouldFetchLegacy =
    !isLoadingResolution && resolutionData && !resolutionData.resolution && router?.query?.id && isLegacyClientEnabled;

  const { data: legacyResolutionData, isLoading: isLoadingLegacyResolution } = useSWR<any>(
    shouldFetchLegacy ? [getLegacyResolutionQuery, { id: router.query.id }] : null,
    legacyFetcherWithParams,
    { refreshInterval: REFRESH_INTERVAL_MS },
  );

  return {
    resolution:
      resolutionData?.resolution ||
      (legacyResolutionData?.resolution ? { ...legacyResolutionData.resolution, isLegacy: true } : null),
    isLoading: isLoadingResolution || isLoadingLegacyResolution,
  };
}
