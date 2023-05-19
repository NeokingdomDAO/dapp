import { ResolutionManager } from "@contracts/typechain";

import { useContext } from "react";

import { addToIpfs } from "@lib/ipfs";

import { ResolutionFormBase } from "@store/resolutionFormStore";

import { ContractsContext } from "../contexts/ContractsContext";
import useBlockhainTransaction from "./useBlockchainTransaction";

type SubmitParams = {
  vetoTypeId: string | null;
  resolutionId: string;
  currentResolution: ResolutionFormBase;
};

export default function useResolutionUpdate() {
  const { resolutionManagerContract } = useContext(ContractsContext);
  const { executeTx } = useBlockhainTransaction();

  return {
    onSubmit: async ({ vetoTypeId, resolutionId, currentResolution }: SubmitParams) => {
      const ipfsId = await addToIpfs(currentResolution);
      const resolutionTypeId = Number(vetoTypeId || currentResolution.typeId);
      return executeTx<ResolutionManager["updateResolution"], Parameters<ResolutionManager["updateResolution"]>>({
        contractMethod: resolutionManagerContract?.updateResolution,
        params: [resolutionId, ipfsId, resolutionTypeId, !!vetoTypeId, [], []],
        onSuccessMessage: "Preliminary draft resolution successfully updated",
        onErrorMessage: "Failed to update preliminary draft resolution",
      });
    },
  };
}
