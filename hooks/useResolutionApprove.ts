import { ResolutionManager } from "@contracts/typechain";

import { useContext } from "react";

import { ContractsContext } from "../contexts/ContractsContext";
import useBlockchainTransaction from "./useBlockchainTransaction";

type SubmitParams = {
  resolutionId: string;
};

export const BLOCKCHAIN_TX_STATE_KEY = "approve-resolution";

export default function useResolutionApprove() {
  const { resolutionManagerContract } = useContext(ContractsContext);
  const { executeTx } = useBlockchainTransaction();

  return {
    onSubmit: async ({ resolutionId }: SubmitParams) =>
      executeTx<ResolutionManager["approveResolution"], Parameters<ResolutionManager["approveResolution"]>>({
        contractMethod: resolutionManagerContract?.approveResolution,
        params: [resolutionId],
        onSuccessMessage: "Preliminary draft resolution approved successfully",
        onErrorMessage: "Failed to approve preliminary draft resolution",
        stateKey: BLOCKCHAIN_TX_STATE_KEY,
      }),
  };
}
