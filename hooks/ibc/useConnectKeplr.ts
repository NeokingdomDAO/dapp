import { evmosToEth } from "@evmos/address-converter";
import { Keplr } from "@keplr-wallet/types";

import { useEffect, useState } from "react";

import { CHAIN_TO_ID } from "./utils";

const INITIAL_STATE = {
  evmos: {
    address: "",
    ethAddress: "",
    error: null,
  },
  crescent: {
    address: "",
    ethAddress: "",
    error: null,
  },
} as const;

export default function useConnectKeplr() {
  const hasKeplr = !!window.keplr;
  const [keplr, setKeplr] = useState<Keplr | null>(null);
  const [isConnecting, setConnecting] = useState(false);
  const [networks, setNetworks] = useState<typeof INITIAL_STATE>(INITIAL_STATE);

  const connect = async (network: "evmos" | "crescent") => {
    if (window.keplr) {
      setKeplr(window.keplr);
      try {
        setConnecting(true);
        const result = await window.keplr?.getKey(CHAIN_TO_ID[network]);
        const bech32Address = result.bech32Address;
        setNetworks((prevState) => ({
          ...prevState,
          [network]: {
            address: bech32Address,
            ethAddress: bech32Address.startsWith("evmos") ? evmosToEth(bech32Address) : null,
            error: null,
          },
        }));
      } catch (error) {
        console.error(error);
        setNetworks((prevState) => ({
          ...prevState,
          [network]: {
            address: null,
            ethAddress: null,
            error,
          },
        }));
      }
      setConnecting(false);
    }
  };

  const disconnect = () => {
    if (window.keplr) {
      window.keplr?.disable();
      setKeplr(null);
      setNetworks(INITIAL_STATE);
    }
  };

  return { hasKeplr, keplr, isConnecting, connect, disconnect, networks };
}
