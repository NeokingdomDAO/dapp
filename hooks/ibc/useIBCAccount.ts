import { evmosToEth } from "@evmos/address-converter";

import { useEffect, useState } from "react";

import { useKeplrContext } from "../../contexts/KeplrContext";
import { CHAIN_TO_ID, CosmosChains } from "./utils";

type Account = {
  address?: string;
  ethAddress?: string;
};

export default function useIBCAccount(chain: CosmosChains) {
  const { keplr } = useKeplrContext();
  const [account, setAccount] = useState<Account>();
  const [error, setError] = useState<string>();
  const chainId = CHAIN_TO_ID[chain];

  useEffect(() => {
    console.log("useIBCAccount", keplr);
    keplr
      ?.getKey(chainId)
      .then((result) => {
        if (result) {
          const bech32Address = result.bech32Address;

          setAccount({
            address: bech32Address,
            ethAddress: bech32Address.startsWith("evmos") ? evmosToEth(result.bech32Address) : undefined,
          });
        }
      })
      .catch((e) => setError(e.toString()));
  }, [keplr]);

  return { ...account, error };
}
