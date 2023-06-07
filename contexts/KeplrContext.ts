import { createContext, useContext } from "react";

import useConnectKeplr from "@hooks/ibc/useConnectKeplr";

export const KeplrContext = createContext<Partial<ReturnType<typeof useConnectKeplr>>>({});

export const useKeplrContext = () => useContext(KeplrContext);
