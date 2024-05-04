import { ResolutionManager } from "@contracts/typechain";

import { useContext } from "react";

import { addResolution } from "@lib/resolutions/net";

import useBlockchainTransactionStore from "@store/blockchainTransactionStore";
import { ResolutionFormBase } from "@store/resolutionFormStore";

import { ContractsContext } from "../contexts/ContractsContext";
import useBlockchainTransaction from "./useBlockchainTransaction";

type SubmitParams = {
  vetoTypeId: string | null;
  currentResolution: ResolutionFormBase;
  executionTo?: string[];
  executionData?: string[];
  isRewards?: boolean;
};

export default function useResolutionCreate() {
  const { resolutionManagerContract } = useContext(ContractsContext);
  const { executeTx } = useBlockchainTransaction();
  const { setIsLoading } = useBlockchainTransactionStore();

  return {
    onSubmit: async ({
      vetoTypeId,
      currentResolution,
      executionTo = [],
      executionData = [],
      isRewards = false,
    }: SubmitParams) => {
      setIsLoading(true);
      const hash = await addResolution({ ...currentResolution, isRewards });
      return;
      const resolutionTypeId = Number(vetoTypeId || currentResolution.typeId);
      if ((currentResolution.exclusionAddress || "").trim() !== "") {
        return executeTx<
          ResolutionManager["createResolutionWithExclusion"],
          Parameters<ResolutionManager["createResolutionWithExclusion"]>
        >({
          contractMethod: resolutionManagerContract?.createResolutionWithExclusion,
          params: [hash, resolutionTypeId, executionTo, executionData, currentResolution.exclusionAddress],
          onSuccessMessage: "Preliminary draft resolution successfully created",
          onErrorMessage: "Error while creating preliminary draft resolution",
        });
      }
      return executeTx<ResolutionManager["createResolution"], Parameters<ResolutionManager["createResolution"]>>({
        contractMethod: resolutionManagerContract?.createResolution,
        params: [hash, resolutionTypeId, !!vetoTypeId, executionTo, executionData],
        onSuccessMessage: "Preliminary draft resolution successfully created",
        onErrorMessage: "Error while creating preliminary draft resolution",
      });
    },
  };
}
