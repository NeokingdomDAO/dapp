import { NeokingdomToken } from "@contracts/typechain";
import { useContractsContext } from "contexts/ContractsContext";
import { ethers } from "ethers";

import { BLOCKCHAIN_TRANSACTION_KEYS } from "@lib/constants";

import useBlockchainTransaction from "./useBlockchainTransaction";

export default function useApproveToDeposit() {
  const { neokingdomTokenContract, governanceTokenContractAddress } = useContractsContext();
  const { executeTx } = useBlockchainTransaction();

  return {
    onSubmit: async () => {
      return executeTx<NeokingdomToken["approve"], Parameters<NeokingdomToken["approve"]>>({
        contractMethod: neokingdomTokenContract?.approve,
        params: [governanceTokenContractAddress as string, ethers.constants.MaxUint256],
        onSuccessMessage: `Approval successful`,
        onErrorMessage: `Approval failed`,
        stateKey: BLOCKCHAIN_TRANSACTION_KEYS.APPROVE_DEPOSIT_NEOK,
      });
    },
  };
}
