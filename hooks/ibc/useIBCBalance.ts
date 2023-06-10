import { evmosToEth } from "@evmos/address-converter";
import { BalanceByDenomResponse, generateEndpointBalanceByDenom } from "@evmos/provider";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils.js";

import { useEffect, useState } from "react";

import { useContracts } from "@hooks/useContracts";

import { COSMOS_NODE_URL, DENOMS, restOptions } from "./utils";

type Balance = {
  balance?: BigNumber;
  balanceFloat?: number;
  ibc?: BigNumber;
  ibcFloat?: number;
  erc?: BigNumber;
  ercFloat?: number;
};

export default function useIBCBalance({ address }: { address?: string | undefined }) {
  const { neokingdomTokenContract } = useContracts();
  const [balance, setBalance] = useState<Balance>({});
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let nodeUrl: string;
    let denom: string;
    let ethAddress: string;

    if (!address) {
      return;
    }

    if (address.startsWith("evmos")) {
      nodeUrl = COSMOS_NODE_URL["evmos"];
      denom = DENOMS["evmos"];
      ethAddress = evmosToEth(address);
    } else if (address.startsWith("cre")) {
      nodeUrl = COSMOS_NODE_URL["crescent"];
      denom = DENOMS["crescent"];
    } else {
      setError("Invalid address");
      return;
    }
    const queryEndpoint = `${nodeUrl}${generateEndpointBalanceByDenom(address, denom)}`;

    const reload = async () => {
      let b: Balance = {};
      if (!neokingdomTokenContract) {
        return;
      }
      setIsLoading(true);
      let rawResult: Response;
      try {
        rawResult = await fetch(queryEndpoint, restOptions);
      } catch (e) {
        setError((e as any).toString());
        setBalance({});
        setIsLoading(false);
        return;
      }
      const result = (await rawResult.json()) as BalanceByDenomResponse;
      const amount = result.balance.amount;
      b.ibc = BigNumber.from(amount);
      b.ibcFloat = parseFloat(formatEther(amount));

      b.erc = BigNumber.from(0);
      b.ercFloat = 0;

      if (ethAddress) {
        const balanceErc20 = (await neokingdomTokenContract?.balanceOf(ethAddress)) as BigNumber;
        b.erc = balanceErc20;
        b.ercFloat = parseFloat(formatEther(b.erc));
      }

      b.balance = b.ibc.add(b.erc);
      b.balanceFloat = parseFloat(formatEther(b.balance));
      setBalance(b);
      setIsLoading(false);
    };

    reload();
    const interval = setInterval(reload, 5000);
    return () => clearInterval(interval);
  }, [address, neokingdomTokenContract]);

  return { ...balance, error, isLoading };
}
