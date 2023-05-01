import { NeokingdomToken } from "@contracts/typechain";
import { ethers } from "ethers";

import { BLOCKCHAIN_TRANSACTION_KEYS } from "@lib/constants";

import useBlockhainTransaction from "./useBlockchainTransaction";
import { useContracts } from "./useContracts";

export default function useApproveToDeposit() {
  const { neokingdomTokenContract, governanceTokenContractAddress } = useContracts();
  const { executeTx } = useBlockhainTransaction();

  return {
    onSubmit: async () => {
      return executeTx<NeokingdomToken["approve"], Parameters<NeokingdomToken["approve"]>>({
        contractMethod: neokingdomTokenContract?.approve,
        params: [governanceTokenContractAddress as string, ethers.constants.MaxUint256],
        onSuccessMessage: `Tokens to deposit approved`,
        onErrorMessage: `Error approving tokens to deposit`,
        stateKey: BLOCKCHAIN_TRANSACTION_KEYS.APPROVE_DEPOSIT_NEOK,
      });
    },
  };
}
