import { InternalMarket } from "@contracts/typechain";
import { parseEther } from "ethers/lib/utils.js";

import { useContext } from "react";

import { BLOCKCHAIN_TRANSACTION_KEYS } from "@lib/constants";

import { ContractsContext } from "../contexts/ContractsContext";
import useBlockhainTransaction from "./useBlockchainTransaction";

type SubmitParams = {
  amount: number;
};

export default function useOfferTokens() {
  const { internalMarketContract } = useContext(ContractsContext);
  const { executeTx } = useBlockhainTransaction();

  return {
    onSubmit: async ({ amount }: SubmitParams) => {
      return executeTx<InternalMarket["makeOffer"], Parameters<InternalMarket["makeOffer"]>>({
        contractMethod: internalMarketContract?.makeOffer,
        params: [parseEther(String(amount))],
        onSuccessMessage: "Offer successfully created",
        onErrorMessage: "Failed to create offer",
        stateKey: BLOCKCHAIN_TRANSACTION_KEYS.OFFER_TOKENS,
      });
    },
  };
}
