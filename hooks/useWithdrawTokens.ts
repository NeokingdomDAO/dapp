import { InternalMarket } from "@contracts/typechain";
import { useContractsContext } from "contexts/ContractsContext";
import { parseEther } from "ethers/lib/utils.js";
import { useAccount } from "wagmi";

import useBlockchainTransaction from "./useBlockchainTransaction";

type SubmitParams = {
  amount: number;
  toAddress: string;
};

export default function useWithdrawTokens() {
  const { internalMarketContract } = useContractsContext();
  const { executeTx } = useBlockchainTransaction();
  const { address } = useAccount();

  return {
    onSubmit: async ({ amount, toAddress }: SubmitParams) => {
      return executeTx<InternalMarket["withdraw"], Parameters<InternalMarket["withdraw"]>>({
        contractMethod: internalMarketContract?.withdraw,
        params: [toAddress, parseEther(String(amount))],
        onSuccessMessage: "Tokens successfully withdrawn",
        onErrorMessage:
          address !== toAddress
            ? "Error withdrawing tokens. Please check the withdrawal address!"
            : "Error withdrawing tokens. Try again later",
      });
    },
  };
}
