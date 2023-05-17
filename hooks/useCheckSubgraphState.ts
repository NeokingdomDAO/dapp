import { SnackbarKey } from "notistack";
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
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [mismatch, setMismatch] = useState(false);
  const [snackbarKey, setSnackbarKey] = useState<SnackbarKey | null>(null);
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
        const key = enqueueSnackbar("UI is being synced with the blockchain, please wait...", {
          variant: "warning",
          persist: true,
        });
        setSnackbarKey(key);
      }, NOTIFY_MISMATCH_AFTER_MS);

      return () => {
        clearTimeout(timeout);
      };
    }

    if (snackbarKey) {
      closeSnackbar(snackbarKey);
      setSnackbarKey(null);
      enqueueSnackbar("UI is now in sync", { variant: "success" });
    }
  }, [mismatch]);
}
