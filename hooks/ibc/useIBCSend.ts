import { useState } from "react";

import { sendFromCrescent, sendFromEvmos } from "./utils";

export default function useIBCSend() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const send = async (senderAddress: string, receiverAddress: string, amount: string) => {
    setError(undefined);

    try {
      setIsLoading(true);
      if (senderAddress.startsWith("evmos")) {
        await sendFromEvmos(senderAddress, receiverAddress, amount);
      } else {
        await sendFromCrescent(senderAddress, receiverAddress, amount);
      }
    } catch (e) {
      console.error(e);
      setError((e as any).toString());
    }

    setIsLoading(false);
  };

  return { send, isLoading, error };
}
