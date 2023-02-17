import { useContext } from "react";

import { ContractsContext } from "../contexts/ContractsContext";
import useBlockhainTransaction from "./useBlockchainTransaction";

type SubmitParams = {
  resolutionId: string;
};

export default function useResolutionReject() {
  const { resolutionContract } = useContext(ContractsContext);
  const { executeTx } = useBlockhainTransaction();

  return {
    onSubmit: async ({ resolutionId }: SubmitParams) =>
      executeTx({
        contractMethod: resolutionContract?.rejectResolution,
        params: [resolutionId],
        onSuccessMessage: "Pre draft resolution correctly rejected",
        onErrorMessage: "Error rejecting pre draft resolution",
      }),
  };
}
