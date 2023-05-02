import { InternalMarket } from "@contracts/typechain";
import { parseEther } from "ethers/lib/utils.js";
import { useAccount } from "wagmi";

import useBlockhainTransaction from "./useBlockchainTransaction";
import { useContracts } from "./useContracts";

type SubmitParams = {
  amount: number;
  toAddress: string;
};

export default function useWithdrawTokens() {
  const { internalMarketContract } = useContracts();
  const { executeTx } = useBlockhainTransaction();
  const { address } = useAccount();

  return {
    onSubmit: async ({ amount, toAddress }: SubmitParams) => {
      return executeTx<InternalMarket["withdraw"], Parameters<InternalMarket["withdraw"]>>({
        contractMethod: internalMarketContract?.withdraw,
        params: [toAddress, parseEther(String(amount))],
        onSuccessMessage: "Tokens correctly withdrew",
        onErrorMessage:
          address !== toAddress
            ? "Error withdrawing tokens. Check the withdrawal address!"
            : "Error withdrawing tokens. Please try again later",
      });
    },
  };
}