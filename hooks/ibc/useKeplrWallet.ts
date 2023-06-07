import { useEffect, useState } from "react";

export default function useCosmosAddress({ chain }: { chain: "evmos" | "crescent" }) {
  const chainId = chain === "evmos" ? "evmos_9001-2" : "crescent-1";

  const [account, setAccount] = useState<string>();
  const [shouldConnect, setShouldConnect] = useState(false);

  const connect = () => setShouldConnect(true);

  useEffect(() => {
    window?.keplr?.getKey(chainId).then((a) => setAccount(a?.bech32Address));
  }, [shouldConnect]);

  return { connect, account };
}
