import { AccountResponse } from "@evmos/provider";

import { useState } from "react";

import { useSnackbar } from "@hooks/useSnackbar";

import { sendFromCrescent, sendFromEvmos, sendFromEvmosToEvmos } from "./utils";

export default function useIBCSend(senderAddress: string) {
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const sendTokens = async (
    receiverAddress: string,
    amount: string,
    wallet: { account?: any; walletName?: string },
    account?: AccountResponse["account"] | null,
  ) => {
    try {
      setIsLoading(true);
      let res;

      if (senderAddress.startsWith("evmos") && receiverAddress.startsWith("evmos")) {
        res = await sendFromEvmosToEvmos(
          wallet,
          account as AccountResponse["account"],
          receiverAddress,
          amount,
          enqueueSnackbar,
        );
      } else {
        res = senderAddress.startsWith("evmos")
          ? await sendFromEvmos(wallet, account as AccountResponse["account"], receiverAddress, amount, enqueueSnackbar)
          : await sendFromCrescent(wallet, senderAddress, receiverAddress, amount);
      }
      if (res?.snackbarId) {
        closeSnackbar(res?.snackbarId);
      }
      enqueueSnackbar(`Transaction correctly executed`, { variant: "success" });
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.error(e);
      enqueueSnackbar(`Transaction error: ${e}`, { variant: "error" });
      return false;
    }
    return true;
  };

  return { sendTokens, isLoading };
}
