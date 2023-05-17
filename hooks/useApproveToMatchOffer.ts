import { TokenMock } from "@contracts/typechain";
import { useContractsContext } from "contexts/ContractsContext";
import { ethers } from "ethers";

import { BLOCKCHAIN_TRANSACTION_KEYS } from "@lib/constants";

import useBlockhainTransaction from "./useBlockchainTransaction";

export default function useApproveToMatchOffer() {
  const { usdcContract, internalMarketContractAddress } = useContractsContext();
  const { executeTx } = useBlockhainTransaction();

  return {
    onSubmit: async () => {
      return executeTx<TokenMock["approve"], Parameters<TokenMock["approve"]>>({
        contractMethod: usdcContract?.approve,
        params: [internalMarketContractAddress as string, ethers.constants.MaxUint256],
        onSuccessMessage: `USDC to match offer approved`,
        onErrorMessage: `Error approving USDC to match offer`,
        stateKey: BLOCKCHAIN_TRANSACTION_KEYS.APPROVE_TO_MATCH_OFFER,
      });
    },
  };
}
