import { AccountResponse } from "@evmos/provider";

import { useState } from "react";

import { useSnackbar } from "@hooks/useSnackbar";

import useCosmosAccount from "./useCosmosAccount";
import { sendFromCrescent, sendFromEvmos } from "./utils";

export default function useIBCSend(senderAddress: string) {
  const [isLoading, setIsLoading] = useState(false);
  const { account } = useCosmosAccount(senderAddress);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const send = async (receiverAddress: string, amount: string) => {
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

  return { send, isLoading };
}
