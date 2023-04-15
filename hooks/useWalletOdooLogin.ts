import { useAccount, useSignMessage } from "wagmi";

import { useCallback } from "react";

import { useSnackbar } from "./useSnackbar";
import useUser from "./useUser";

export default function useWalletOdooLogin() {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { enqueueSnackbar } = useSnackbar();

  const { mutateUser } = useUser();

  const handleWalletOdooLogin = useCallback(
    async function () {
      try {
        const challenge = await fetch("/api/walletLogin", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const json = await challenge.json();
        const sig = await signMessageAsync({ message: json.message });

        await fetch("/api/walletLogin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            address,
            sig,
            signingToken: json.signingToken,
          }),
        });
        mutateUser();
      } catch (_) {
        enqueueSnackbar("There was an error signing in", { variant: "error" });
      }
    },
    [address], // eslint-disable-line
  );

  return { handleWalletOdooLogin };
}
