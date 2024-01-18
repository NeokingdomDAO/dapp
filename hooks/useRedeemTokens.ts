import { InternalMarket } from "@contracts/typechain";
import { parseEther } from "ethers/lib/utils.js";

import { useContext } from "react";

import { BLOCKCHAIN_TRANSACTION_KEYS } from "@lib/constants";

import { ContractsContext } from "../contexts/ContractsContext";
import useBlockchainTransaction from "./useBlockchainTransaction";

type SubmitParams = {
  amount: number;
};

export default function useRedeemTokens() {
  const { internalMarketContract } = useContext(ContractsContext);
  const { executeTx } = useBlockchainTransaction();

  return {
    onSubmit: async ({ amount }: SubmitParams) => {
      return executeTx<InternalMarket["redeem"], Parameters<InternalMarket["redeem"]>>({
        contractMethod: internalMarketContract?.redeem,
        params: [parseEther(String(amount))],
        onSuccessMessage: "Token successfully redeemed",
        onErrorMessage: "Failed to redeem token",
        stateKey: BLOCKCHAIN_TRANSACTION_KEYS.REDEEM_TOKENS,
      });
    },
  };
}
