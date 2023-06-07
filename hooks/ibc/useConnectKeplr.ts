import { Keplr } from "@keplr-wallet/types";

import { useState } from "react";

export default function useConnectKeplr() {
  const hasKeplr = !!window.keplr;
  const [isConnected, setIsConnected] = useState(false);
  const [keplr, setKeplr] = useState<Keplr>();

  const connect = () => {
    if (window.keplr) {
      setIsConnected(hasKeplr && true);
      setKeplr(window.keplr);
    }
  };

  return { connect, hasKeplr, keplr, isConnected };
}
