import { SnackbarKey } from "notistack";
import { useAccount, useChainId, useDisconnect } from "wagmi";

import { ReactElement, useCallback } from "react";

import useBlockchainTransactionStore from "@store/blockchainTransactionStore";

import { useSnackbar } from "@hooks/useSnackbar";

const NOTIFY_CONTRACT_ERROR_TIMEOUT = 30000;
const NOTIFY_TX_STUCK_TIMEOUT = 40000;

const CORRECT_NETWORK: any = {
  9001: "Please connect to evmos mainnet",
  9000: "Please connect to evmos testnet",
};

type ExecuteTxParams<TC, TP> = {
  contractMethod: TC | undefined;
  params: TP;
  onSuccessMessage: string | ReactElement;
  onErrorMessage: string | ReactElement;
  stateKey?: string;
};

export default function useBlockhainTransaction() {
  const { set, reset, isLoading } = useBlockchainTransactionStore();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const notifyContractError = useCallback(() => {
    enqueueSnackbar(
      "It looks there's an error with the network, please try reloading the page, or disconnect and reconnect your wallet",
      { variant: "error" },
    );
    reset();
  }, []);

  const notifyTxStuckError = useCallback((snackbar: SnackbarKey) => {
    closeSnackbar(snackbar);
    enqueueSnackbar("It looks the transaction is hanging, feel free to navigate away. It will eventually complete.", {
      variant: "error",
    });
    reset();
  }, []);

  async function executeTx<TC = never, TP = never, TIC extends TC = TC, TIP extends TP = TP>({
    contractMethod,
    params,
    onSuccessMessage,
    onErrorMessage,
    stateKey,
  }: ExecuteTxParams<TIC, TIP>): Promise<boolean> {
    if (!address || !contractMethod || typeof contractMethod !== "function") {
      enqueueSnackbar("Please connect your wallet", { variant: "error" });
      return false;
    }
    set(true, false, stateKey);
    let txAlert: any;
    let timeoutTx: any;
    let timeoutTxStuck: any;
    try {
      timeoutTx = setTimeout(notifyContractError, NOTIFY_CONTRACT_ERROR_TIMEOUT);
      const tx = await contractMethod.apply(null, params);
      clearTimeout(timeoutTx);
      txAlert = enqueueSnackbar("Transaction is being executed, hold tight", {
        variant: "info",
        autoHideDuration: NOTIFY_TX_STUCK_TIMEOUT,
      });
      timeoutTxStuck = setTimeout(() => notifyTxStuckError(txAlert), NOTIFY_TX_STUCK_TIMEOUT);
      set(true, true);
      await tx?.wait();
      clearTimeout(timeoutTxStuck);
      set(true, false);
      closeSnackbar(txAlert);
      enqueueSnackbar(onSuccessMessage, { variant: "success" });
      reset();
      return true;
    } catch (err) {
      // @ts-ignore
      const networkError = CORRECT_NETWORK[err?.network?.chainId];
      if (timeoutTx) clearTimeout(timeoutTx);
      if (timeoutTxStuck) clearTimeout(timeoutTxStuck);
      closeSnackbar(txAlert);

      if (networkError) {
        enqueueSnackbar(`It looks you're connected to the wrong network. ${networkError}`, {
          variant: "error",
          onClose: () => {
            if (networkError) {
              disconnect();
            }
          },
        });
      } else {
        enqueueSnackbar(onErrorMessage, {
          variant: "error",
        });
      }
      console.error(err);
      reset();
      return false;
    }
  }

  return {
    set,
    reset,
    isLoading,
    executeTx,
  };
}
