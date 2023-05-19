import { ResolutionManager } from "@contracts/typechain";

import { useContext } from "react";

import { ContractsContext } from "../contexts/ContractsContext";
import useBlockchainTransaction from "./useBlockchainTransaction";

type SubmitParams = {
  resolutionId: string;
};

export default function useResolutionReject() {
  const { resolutionManagerContract } = useContext(ContractsContext);
  const { executeTx } = useBlockchainTransaction();

  return {
    onSubmit: async ({ resolutionId }: SubmitParams) =>
      executeTx<ResolutionManager["rejectResolution"], Parameters<ResolutionManager["rejectResolution"]>>({
        contractMethod: resolutionManagerContract?.rejectResolution,
        params: [resolutionId],
        onSuccessMessage: "Preliminary draft resolution rejected successfully",
        onErrorMessage: "Failed to reject preliminary draft resolution",
      }),
  };
}
