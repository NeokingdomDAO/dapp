import useSWR from "swr";

import { useMemo } from "react";

import { getResolutionsQuery } from "@graphql/subgraph/queries/get-resolutions-query";
import { useSubgraphGraphQL } from "@graphql/subgraph/subgraph-client";

import { fetcher } from "@lib/net";

const REFRESH_EVERY_MS = 3000;

export default function useGetResolutions() {
  const { data: dbResolutions, isLoading: isLoadingDbResolutions } = useSWR<
    Array<{ title: string; hash: string; isRewards: boolean }>
  >("/api/resolutions", fetcher);

  const { data, isLoading, error } = useSubgraphGraphQL(getResolutionsQuery, {
    refreshInterval: REFRESH_EVERY_MS,
  });

  const dbResolutionsObject = useMemo(() => {
    if (!dbResolutions) return null;
    return dbResolutions.reduce((resObject, res) => {
      resObject[res.hash] = res;
      return resObject;
    }, {} as Record<string, { title: string; hash: string; isRewards: boolean }>);
  }, [dbResolutions]);

  return {
    resolutions: !dbResolutionsObject
      ? [
          ...(data?.resolutions?.map((res) => ({
            ...res,
            title: "🔐 Log in to see title",
            isRewards: false,
          })) || []),
        ]
      : [
          ...(data?.resolutions?.map((res) => ({
            ...res,
            title: dbResolutionsObject[res.hash]?.title,
            isRewards: dbResolutionsObject[res.hash]?.isRewards,
          })) || []),
        ],
    isLoading: isLoading || isLoadingDbResolutions,
    error,
  };
}
