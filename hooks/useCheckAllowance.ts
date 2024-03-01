import { GovernanceToken, NeokingdomToken, TokenMock } from "@contracts/typechain";
import { formatUnits } from "ethers/lib/utils.js";
import { SnackbarKey } from "notistack";
import { useAccount, useDisconnect } from "wagmi";

import { useCallback, useEffect, useState } from "react";

import { useSnackbar } from "./useSnackbar";

let globalSnackbar: SnackbarKey = "";

export default function useCheckAllowance(
  contract?: GovernanceToken | NeokingdomToken | TokenMock | undefined,
  contractAddress?: string | undefined,
) {
  const [allowance, setAllowance] = useState(0);
  const { disconnect } = useDisconnect();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { address } = useAccount();

  const refreshAllowanceFromContract = useCallback(async () => {
    if (contract) {
      const decimals = await contract.decimals();
      const allowance = await contract.allowance(address as string, contractAddress as string);
      if (allowance) {
        try {
          setAllowance(Number(formatUnits(allowance, decimals)));
        } catch (error) {
          setAllowance(Number.MAX_SAFE_INTEGER);
        }
      }
    }
  }, [contract]);

  useEffect(() => {
    refreshAllowanceFromContract();
  }, [refreshAllowanceFromContract]);

  return {
    allowance,
    refreshAllowanceFromContract,
  };
}
