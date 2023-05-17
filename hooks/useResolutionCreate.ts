import { ResolutionManager } from "@contracts/typechain";

import { useContext } from "react";

import { addToIpfs } from "@lib/ipfs";

import { ResolutionFormBase } from "@store/resolutionFormStore";

import { ContractsContext } from "../contexts/ContractsContext";
import useBlockhainTransaction from "./useBlockchainTransaction";

type SubmitParams = {
  vetoTypeId: string | null;
  currentResolution: ResolutionFormBase;
  executionTo?: string[];
  executionData?: string[];
};

export default function useResolutionCreate() {
  const { resolutionManagerContract } = useContext(ContractsContext);
  const { executeTx } = useBlockhainTransaction();

  return {
    onSubmit: async ({ vetoTypeId, currentResolution, executionTo = [], executionData = [] }: SubmitParams) => {
      const ipfsId = await addToIpfs(currentResolution);
      const resolutionTypeId = Number(vetoTypeId || currentResolution.typeId);
      return executeTx<ResolutionManager["createResolution"], Parameters<ResolutionManager["createResolution"]>>({
        contractMethod: resolutionManagerContract?.createResolution,
        params: [ipfsId, resolutionTypeId, !!vetoTypeId, executionTo, executionData],
        onSuccessMessage: "Preliminary draft resolution correctly created",
        onErrorMessage: "Error creating preliminary draft resolution",
      });
    },
  };
}
