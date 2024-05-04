import { ResolutionManager } from "@contracts/typechain";

import { useContext } from "react";

import { addResolution } from "@lib/resolutions/net";

import useBlockchainTransactionStore from "@store/blockchainTransactionStore";
import { ResolutionFormBase } from "@store/resolutionFormStore";

import { ContractsContext } from "../contexts/ContractsContext";
import useBlockchainTransaction from "./useBlockchainTransaction";

type SubmitParams = {
  vetoTypeId: string | null;
  resolutionId: string;
  currentResolution: Omit<ResolutionFormBase, "exclusionAddress">;
};

export default function useResolutionUpdate() {
  const { resolutionManagerContract } = useContext(ContractsContext);
  const { executeTx } = useBlockchainTransaction();
  const { setIsLoading } = useBlockchainTransactionStore();

  return {
    onSubmit: async ({ vetoTypeId, resolutionId, currentResolution }: SubmitParams) => {
      setIsLoading(true);
      const hash = await addResolution(currentResolution);
      const resolutionTypeId = Number(vetoTypeId || currentResolution.typeId);
      return executeTx<ResolutionManager["updateResolution"], Parameters<ResolutionManager["updateResolution"]>>({
        contractMethod: resolutionManagerContract?.updateResolution,
        params: [resolutionId, hash, resolutionTypeId, !!vetoTypeId, [], []],
        onSuccessMessage: "Preliminary draft resolution successfully updated",
        onErrorMessage: "Failed to update preliminary draft resolution",
      });
    },
  };
}
