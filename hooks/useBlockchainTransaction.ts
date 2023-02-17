import { useSnackbar } from "notistack";
import { useAccount } from "wagmi";

import useBlockchainTransactionStore from "@store/blockchainTransactionStore";

const MAX_TX_WAIT = 60000; // 1 minute

type ExecuteTxParams = {
  contractMethod: any;
  params: any[];
  onSuccessMessage: string;
  onErrorMessage: string;
  stateKey?: string;
};

export default function useBlockhainTransaction() {
  const { set, reset } = useBlockchainTransactionStore();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { address } = useAccount();

  return {
    set,
    reset,
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
      try {
        const tx = await contractMethod.apply(null, params);
        set(true, true);
        const txAlert = enqueueSnackbar("Transaction is being executed, hold tight", {
          variant: "info",
          autoHideDuration: MAX_TX_WAIT,
        });
        await tx?.wait();
        set(true, false);
        closeSnackbar(txAlert);
        enqueueSnackbar(onSuccessMessage, { variant: "success" });
        reset();
        return true;
      } catch (err) {
        enqueueSnackbar(onErrorMessage, { variant: "error" });
        console.error(err);
        reset();
        return false;
      }
    },
  };
}
