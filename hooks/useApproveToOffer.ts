import { GovernanceToken } from "@contracts/typechain";
import { useContractsContext } from "contexts/ContractsContext";
import { ethers } from "ethers";

import { BLOCKCHAIN_TRANSACTION_KEYS } from "@lib/constants";

import useBlockhainTransaction from "./useBlockchainTransaction";

export default function useApproveToOffer() {
  const { governanceTokenContract, internalMarketContractAddress } = useContractsContext();
  const { executeTx } = useBlockhainTransaction();

  return {
    onSubmit: async () => {
      return executeTx<GovernanceToken["approve"], Parameters<GovernanceToken["approve"]>>({
        contractMethod: governanceTokenContract?.approve,
        params: [internalMarketContractAddress as string, ethers.constants.MaxUint256],
        onSuccessMessage: `Tokens to offer approved`,
        onErrorMessage: `Error approving tokens to offer`,
        stateKey: BLOCKCHAIN_TRANSACTION_KEYS.APPROVE_TO_OFFER,
      });
    },
  };
}
