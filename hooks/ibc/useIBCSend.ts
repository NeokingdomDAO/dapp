import { useState } from "react";

import { sendFromEvmos } from "./utils";

export default function useIBCSend() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const send = async (senderAddress: string, receiverAddress: string, amount: string) => {
    setError(undefined);

    try {
      setIsLoading(true);
      await sendFromEvmos(senderAddress, receiverAddress, amount);
    } catch (e) {
      setError((e as any).toString());
    }

    setIsLoading(false);
  };

  return { send, isLoading, error };
}
