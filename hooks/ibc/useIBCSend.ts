import { AccountResponse } from "@evmos/provider";

import { useState } from "react";

import { useSnackbar } from "@hooks/useSnackbar";

import { sendFromCrescent, sendFromEvmos } from "./utils";

export default function useIBCSend(senderAddress: string) {
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const sendTokens = async (receiverAddress: string, amount: string, account?: AccountResponse["account"] | null) => {
    try {
      setIsLoading(true);
      const res = senderAddress.startsWith("evmos")
        ? await sendFromEvmos(account as AccountResponse["account"], receiverAddress, amount, enqueueSnackbar)
        : await sendFromCrescent(senderAddress, receiverAddress, amount);
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
