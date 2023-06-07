import { BalanceByDenomResponse, generateEndpointBalanceByDenom } from "@evmos/provider";
import { formatEther } from "ethers/lib/utils.js";

import { useEffect, useState } from "react";

import { COSMOS_NODE_URL, DENOMS, restOptions } from "./utils";

export default function useIBCBalance({ address }: { address?: string }) {
  const [balance, setBalance] = useState<string>();
  const [balanceFloat, setBalanceFloat] = useState<number>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    let nodeUrl: string;
    let denom: string;
    if (!address) {
      return;
    }

    if (address.startsWith("evmos")) {
      nodeUrl = COSMOS_NODE_URL["evmos"];
      denom = DENOMS["evmos"];
    } else if (address.startsWith("cre")) {
      nodeUrl = COSMOS_NODE_URL["crescent"];
      denom = DENOMS["crescent"];
    } else {
      setError("Invalid address");
      return;
    }
    const queryEndpoint = `${nodeUrl}${generateEndpointBalanceByDenom(address, denom)}`;

    const reload = async () => {
      let rawResult: Response;
      try {
        rawResult = await fetch(queryEndpoint, restOptions);
      } catch (e) {
        setError((e as any).toString());
        setBalance(undefined);
        setBalanceFloat(undefined);
        return;
      }
      const result = (await rawResult.json()) as BalanceByDenomResponse;
      console.log("useIBCBalance", result);
      const amount = result.balance.amount;
      setBalance(amount);
      setBalanceFloat(parseFloat(formatEther(amount)));
    };
    reload();
    const interval = setInterval(reload, 5000);
    return () => clearInterval(interval);
  }, [address]);

  return { balance, balanceFloat, error };
}
