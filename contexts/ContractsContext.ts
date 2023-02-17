import { createContext, useContext } from "react";

import { ResolutionManager, TelediskoToken } from "../contracts/typechain";

export type ContractsContextType = {
  resolutionContract?: ResolutionManager;
  tokenContract?: TelediskoToken;
};

export const ContractsContext = createContext<ContractsContextType>({});

export const useContractsContext = () => useContext(ContractsContext);
