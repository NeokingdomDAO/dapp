import { InternalMarket } from "@contracts/typechain";
import { useContractsContext } from "contexts/ContractsContext";
import { parseEther } from "ethers/lib/utils.js";

import { BLOCKCHAIN_TRANSACTION_KEYS } from "@lib/constants";
import { TOKEN_SYMBOL } from "@lib/utils";

import useBlockchainTransaction from "./useBlockchainTransaction";

export default function useDeposit() {
  const { internalMarketContract } = useContractsContext();
  const { executeTx } = useBlockchainTransaction();

  return {
    onSubmit: async ({ amount }: { amount: number }) => {
      return executeTx<InternalMarket["deposit"], Parameters<InternalMarket["deposit"]>>({
        contractMethod: internalMarketContract?.deposit,
        params: [parseEther(String(amount))],
        onSuccessMessage: `${TOKEN_SYMBOL} deposited successfully`,
        onErrorMessage: `Error while depositing NEOK`,
        stateKey: BLOCKCHAIN_TRANSACTION_KEYS.DEPOSIT_NEOK,
      });
    },
  };
}
