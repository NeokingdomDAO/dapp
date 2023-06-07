import { useEffect, useState } from "react";

import { useKeplrContext } from "../../contexts/KeplrContext";
import { CHAIN_TO_ID, CosmosChains } from "./utils";

export default function useIBCAccount(chain: CosmosChains) {
  const { keplr } = useKeplrContext();
  const [address, setAddress] = useState<string>();
  const [error, setError] = useState<string>();
  const chainId = CHAIN_TO_ID[chain];

  useEffect(() => {
    console.log("useIBCAccount", keplr);
    keplr
      ?.getKey(chainId)
      .then((a) => setAddress(a?.bech32Address))
      .catch((e) => setError(e.toString()));
  }, [keplr]);

  return { address, error };
}
