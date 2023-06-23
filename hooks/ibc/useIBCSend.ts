import { useState } from "react";

import { useSnackbar } from "@hooks/useSnackbar";

import { sendFromCrescent, sendFromEvmos } from "./utils";

export default function useIBCSend() {
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const send = async (senderAddress: string, receiverAddress: string, amount: string) => {
    console.log("🐞 > senderAddress:", senderAddress);
    console.log("🐞 > receiverAddress:", receiverAddress);
    console.log("🐞 > amount:", amount);
    try {
      setIsLoading(true);
      const res = senderAddress.startsWith("evmos")
        ? await sendFromEvmos(senderAddress, receiverAddress, amount, enqueueSnackbar)
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
