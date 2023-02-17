import { useContext } from "react";

import { ContractsContext } from "../contexts/ContractsContext";
import useBlockhainTransaction from "./useBlockchainTransaction";

type SubmitParams = {
  resolutionId: string;
};

export const BLOCKCHAIN_TX_STATE_KEY = "approve-resolution";

export default function useResolutionApprove() {
  const { resolutionContract } = useContext(ContractsContext);
  const { executeTx } = useBlockhainTransaction();

  return {
    onSubmit: async ({ resolutionId }: SubmitParams) =>
      executeTx({
        contractMethod: resolutionContract?.approveResolution,
        params: [resolutionId],
        onSuccessMessage: "Pre draft resolution correctly approved",
        onErrorMessage: "Error approving pre draft resolution",
        stateKey: BLOCKCHAIN_TX_STATE_KEY,
      }),
  };
}
