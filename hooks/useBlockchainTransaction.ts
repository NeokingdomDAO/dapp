import { useAccount } from "wagmi";

import { ReactElement } from "react";

import useBlockchainTransactionStore from "@store/blockchainTransactionStore";

import { useSnackbar } from "@hooks/useSnackbar";

const MAX_TX_WAIT = 60000; // 1 minute

type ExecuteTxParams = {
  contractMethod: any;
  params: any[];
  onSuccessMessage: string | ReactElement;
  onErrorMessage: string | ReactElement;
  stateKey?: string;
};

export default function useBlockhainTransaction() {
  const { set, reset, isLoading } = useBlockchainTransactionStore();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { address } = useAccount();

  return {
    set,
    reset,
    isLoading,
    executeTx: async ({
      contractMethod,
      params,
      onSuccessMessage,
      onErrorMessage,
      stateKey,
    }: ExecuteTxParams): Promise<boolean> => {
      if (!address) {
        enqueueSnackbar("Please connect your wallet", { variant: "error" });
        return false;
      }
      set(true, false, stateKey);
      let txAlert;
      try {
        const tx = await contractMethod.apply(null, params);
        txAlert = enqueueSnackbar("Transaction is being executed, hold tight", {
          variant: "info",
          autoHideDuration: MAX_TX_WAIT,
        });
        set(true, true);
        await tx?.wait();
        set(true, false);
        closeSnackbar(txAlert);
        enqueueSnackbar(onSuccessMessage, { variant: "success" });
        reset();
        return true;
      } catch (err) {
        closeSnackbar(txAlert);
        enqueueSnackbar(onErrorMessage, { variant: "error" });
        console.error(err);
        reset();
        return false;
      }
    },
  };
}
