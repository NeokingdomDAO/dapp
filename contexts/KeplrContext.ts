import { createContext, useContext } from "react";

// @ts-expect-error Cannot find module '@hooks/ibc/useConnectKeplr' or its corresponding type declarations.
import useConnectKeplr from "@hooks/ibc/useConnectKeplr";

export const KeplrContext = createContext<Partial<ReturnType<typeof useConnectKeplr>>>({});

export const useKeplrContext = () => useContext(KeplrContext);
