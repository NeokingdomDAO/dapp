import { GovernanceToken, NeokingdomToken, TokenMock } from "@contracts/typechain";
import { formatEther } from "ethers/lib/utils.js";
import { SnackbarKey } from "notistack";
import { useAccount, useDisconnect, useProvider } from "wagmi";

import { useCallback, useEffect, useState } from "react";

import { useSnackbar } from "./useSnackbar";

let globSnackbar: SnackbarKey = "";

export default function useCheckAllowance(
  contract?: GovernanceToken | NeokingdomToken | TokenMock | undefined,
  contractAddress?: string | undefined,
) {
  const [allowance, setAllowance] = useState(0);
  const { disconnect } = useDisconnect();
  const { chains } = useProvider();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { address } = useAccount();

  const refreshAllowanceFromContract = useCallback(async () => {
    if (contract) {
      try {
        const allowance = await contract?.allowance(address as string, contractAddress as string);
        if (allowance) {
          setAllowance(Number(formatEther(allowance)));
        }
      } catch (error) {
        closeSnackbar(globSnackbar);
        const stackbarKey = enqueueSnackbar(`You should connect to the ${chains?.[0]?.name} network`, {
          variant: "error",
        });
        globSnackbar = stackbarKey;
        disconnect();
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
