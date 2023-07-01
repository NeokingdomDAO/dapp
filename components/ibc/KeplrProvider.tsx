import { KeplrContext } from "contexts/KeplrContext";

import { ReactElement } from "react";

import useConnectKeplr from "@hooks/ibc/useConnectKeplr";

export default function KeplrProvider({ children }: { children: ReactElement }) {
  const value = useConnectKeplr();
  return <KeplrContext.Provider value={value}>{children}</KeplrContext.Provider>;
}
