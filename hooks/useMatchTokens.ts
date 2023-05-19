import { InternalMarket } from "@contracts/typechain";
import { useContractsContext } from "contexts/ContractsContext";
import { parseEther } from "ethers/lib/utils.js";

import { BLOCKCHAIN_TRANSACTION_KEYS } from "@lib/constants";

import useBlockhainTransaction from "./useBlockchainTransaction";

type SubmitParams = {
  amount: number;
  offerUserAddress: string;
};

export default function useMatchTokens() {
  const { internalMarketContract } = useContractsContext();
  const { executeTx } = useBlockhainTransaction();

  return {
    onSubmit: async ({ offerUserAddress, amount }: SubmitParams) => {
      return executeTx<InternalMarket["matchOffer"], Parameters<InternalMarket["matchOffer"]>>({
        contractMethod: internalMarketContract?.matchOffer,
        params: [offerUserAddress, parseEther(String(amount))],
        onSuccessMessage: "Offer successfully matched",
        onErrorMessage: "Failed to match offer",
        stateKey: BLOCKCHAIN_TRANSACTION_KEYS.MATCH_TOKENS,
      });
    },
  };
}
