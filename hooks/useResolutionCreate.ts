import { ResolutionManager } from "@contracts/typechain";

import { useContext } from "react";

import { addToIpfs } from "@lib/ipfs";

import { ResolutionFormBase } from "@store/resolutionFormStore";

import { ContractsContext } from "../contexts/ContractsContext";
import useBlockchainTransaction from "./useBlockchainTransaction";

type SubmitParams = {
  vetoTypeId: string | null;
  currentResolution: ResolutionFormBase;
  executionTo?: string[];
  executionData?: string[];
  metadata?: {};
};

export default function useResolutionCreate() {
  const { resolutionManagerContract } = useContext(ContractsContext);
  const { executeTx } = useBlockchainTransaction();

  return {
    onSubmit: async ({
      vetoTypeId,
      currentResolution,
      executionTo = [],
      executionData = [],
      metadata = {},
    }: SubmitParams) => {
      const ipfsId = await addToIpfs({ ...currentResolution, metadata });
      const resolutionTypeId = Number(vetoTypeId || currentResolution.typeId);
      if ((currentResolution.exclusionAddress || "").trim() !== "") {
        return executeTx<
          ResolutionManager["createResolutionWithExclusion"],
          Parameters<ResolutionManager["createResolutionWithExclusion"]>
        >({
          contractMethod: resolutionManagerContract?.createResolutionWithExclusion,
          params: [ipfsId, resolutionTypeId, executionTo, executionData, currentResolution.exclusionAddress],
          onSuccessMessage: "Preliminary draft resolution successfully created",
          onErrorMessage: "Error while creating preliminary draft resolution",
        });
      }
      return executeTx<ResolutionManager["createResolution"], Parameters<ResolutionManager["createResolution"]>>({
        contractMethod: resolutionManagerContract?.createResolution,
        params: [ipfsId, resolutionTypeId, !!vetoTypeId, executionTo, executionData],
        onSuccessMessage: "Preliminary draft resolution successfully created",
        onErrorMessage: "Error while creating preliminary draft resolution",
      });
    },
  };
}
