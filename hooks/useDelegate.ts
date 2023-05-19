import { Voting } from "@contracts/typechain";

import { ReactElement, useContext } from "react";

import { ContractsContext } from "../contexts/ContractsContext";
import useBlockchainTransaction from "./useBlockchainTransaction";

type SubmitParams = {
  delegatingAddress: string;
  successElement: ReactElement;
  errorElement: ReactElement;
};

export default function useDelegate() {
  const { votingContract } = useContext(ContractsContext);
  const { executeTx } = useBlockchainTransaction();

  return {
    onSubmit: async ({ delegatingAddress, successElement, errorElement }: SubmitParams) => {
      return executeTx<Voting["delegate"], Parameters<Voting["delegate"]>>({
        contractMethod: votingContract?.delegate,
        params: [delegatingAddress],
        onSuccessMessage: successElement,
        onErrorMessage: errorElement,
      });
    },
  };
}
