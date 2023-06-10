import { NeokingdomToken, NeokingdomToken__factory } from "@contracts/typechain";
import { Provider } from "@ethersproject/providers";
import { evmosToEth } from "@evmos/address-converter";
import { BalanceByDenomResponse, generateEndpointBalanceByDenom } from "@evmos/provider";
import { useContractsContext } from "contexts/ContractsContext";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils.js";
import { useNetwork, useProvider } from "wagmi";

import { useEffect, useState } from "react";

import networksNeoKingdom from "../../networks/neokingdom.json";
import networksTeledisko from "../../networks/teledisko.json";
import { COSMOS_NODE_URL, DENOMS, restOptions } from "./utils";

type Balance = {
  balance?: BigNumber;
  balanceFloat?: number;
  ibc?: BigNumber;
  ibcFloat?: number;
  erc?: BigNumber;
  ercFloat?: number;
};

const networks: Record<string, any> =
  process.env.NEXT_PUBLIC_PROJECT_KEY === "neokingdom" ? networksNeoKingdom : networksTeledisko;

const getNeokingdomTokenContract = (chainId: string, provider: Provider): NeokingdomToken => {
  console.log("chainid is", chainId);
  const address = networks[chainId]["NeokingdomToken"]?.address;
  return NeokingdomToken__factory.connect(address, provider);
};

export default function useIBCBalance({ address }: { address?: string | undefined }) {
  //const { neokingdomTokenContract } = useContractsContext();
  const provider = useProvider();
  const [balance, setBalance] = useState<Balance>({});
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { chain } = useNetwork();
  const chainId = chain?.id ? String(chain?.id) : undefined;

  useEffect(() => {
    console.log(`chain id is "${chainId}"`);

    if (!address || !chainId) {
      return;
    }

    const neokingdomTokenContract = getNeokingdomTokenContract(chainId, provider);
    let nodeUrl: string;
    let denom: string;
    let ethAddress: string;

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
        console.log("no contract found");
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
      console.log("result is", result);
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
  }, [address, chainId, provider]);

  return { ...balance, error, isLoading };
}
