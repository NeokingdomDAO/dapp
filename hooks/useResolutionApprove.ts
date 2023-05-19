import { ResolutionManager } from "@contracts/typechain";

import { useContext } from "react";

import { ContractsContext } from "../contexts/ContractsContext";
import useBlockhainTransaction from "./useBlockchainTransaction";

type SubmitParams = {
  resolutionId: string;
};

export const BLOCKCHAIN_TX_STATE_KEY = "approve-resolution";

export default function useResolutionApprove() {
  const { resolutionManagerContract } = useContext(ContractsContext);
  const { executeTx } = useBlockhainTransaction();

  return {
    onSubmit: async ({ resolutionId }: SubmitParams) =>
      executeTx<ResolutionManager["approveResolution"], Parameters<ResolutionManager["approveResolution"]>>({
        contractMethod: resolutionManagerContract?.approveResolution,
        params: [resolutionId],
        onSuccessMessage: "Preliminart draft resolution approved successfully",
        onErrorMessage: "Failed to approve preliminary draft resolution",
        stateKey: BLOCKCHAIN_TX_STATE_KEY,
      }),
  };
}
