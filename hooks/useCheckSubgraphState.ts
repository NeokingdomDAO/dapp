import useSWR from "swr";
import { useBlockNumber } from "wagmi";

import { useEffect, useState } from "react";

import { fetcher } from "@graphql/client";
import { getSubgraphState } from "@graphql/queries/get-subgraph-state";

import { useSnackbar } from "./useSnackbar";

const NOTIFY_MISMATCH_AFTER_MS = 10000;
const REFETCH_AFTER_MS = 3000;

export function useCheckSubgraphState() {
  const { data, isLoading } = useSWR<any>(getSubgraphState, fetcher, { refreshInterval: REFETCH_AFTER_MS });
  const [mismatch, setMismatch] = useState(false);
  const [shouldNotifyMismatch, setShouldNotifyMismatch] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const graphBlockNumber = data?.state?.block?.number;
  const {
    data: blockNumber,
    isLoading: isLoadingBlockNumber,
    refetch,
    isRefetching,
  } = useBlockNumber({ cacheTime: REFETCH_AFTER_MS });

  useEffect(() => {
    (async () => {
      await refetch();
    })();
  }, [graphBlockNumber]);

  useEffect(() => {
    if (!isLoading && !isLoadingBlockNumber && !isRefetching) {
      setMismatch(graphBlockNumber !== blockNumber);
    }
  }, [isLoading, isLoadingBlockNumber, isRefetching, blockNumber, graphBlockNumber]);

  useEffect(() => {
    if (mismatch) {
      const timeout = setTimeout(() => {
        setShouldNotifyMismatch(true);
      }, NOTIFY_MISMATCH_AFTER_MS);

      return () => {
        clearTimeout(timeout);
      };
    }

    setShouldNotifyMismatch(false);
  }, [mismatch]);

  useEffect(() => {
    // so, when it actually became true we need to notify when it becomes false again (when it's synced)
    if (shouldNotifyMismatch) {
      return () => {
        enqueueSnackbar("Synchronization complete", { variant: "success", autoHideDuration: 3000 });
      };
    }
  }, [shouldNotifyMismatch]);

  return {
    shouldNotifyMismatch,
    difference: Math.abs((blockNumber || 0) - graphBlockNumber),
  };
}
