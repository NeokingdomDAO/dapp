import { useBlockNumber } from "wagmi";

import { useEffect, useState } from "react";

import { getSubgraphState } from "@graphql/queries/subgraph/get-subgraph-state-query";

import { useGraphQL } from "../lib/graphql/useGraphql";
import { useSnackbar } from "./useSnackbar";

const NOTIFY_MISMATCH_AFTER_MS = 10000;
const REFETCH_AFTER_MS = 3000;
const DIFFERENCE_TO_NOTIFY = 2;

export function useCheckSubgraphState() {
  const { data, isLoading } = useGraphQL(getSubgraphState, { refreshInterval: REFETCH_AFTER_MS });
  const [mismatch, setMismatch] = useState(false);
  const [shouldNotifyMismatch, setShouldNotifyMismatch] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const graphBlockNumber = data?.state?.block?.number || 0;

  const {
    data: blockNumberData,
    isLoading: isLoadingBlockNumber,
    refetch,
    isRefetching,
  } = useBlockNumber({ cacheTime: REFETCH_AFTER_MS });

  const blockNumber = Number(blockNumberData || BigInt(0));

  useEffect(() => {
    (async () => {
      await refetch();
    })();
  }, [graphBlockNumber]);

  useEffect(() => {
    if (!isLoading && !isLoadingBlockNumber && !isRefetching) {
      const diff = Math.abs(blockNumber - graphBlockNumber);
      setMismatch(diff > DIFFERENCE_TO_NOTIFY);
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
        if (shouldNotifyMismatch) return; // if it's still true, don't notify (it means we just changed page)
        enqueueSnackbar("Synchronization complete", {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
        });
      };
    }
  }, [shouldNotifyMismatch]);

  return {
    shouldNotifyMismatch,
    difference: Math.abs(blockNumber - graphBlockNumber),
  };
}
