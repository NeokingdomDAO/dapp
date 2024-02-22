import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";

import { Alert, AlertTitle, Box, Button } from "@mui/material";

import useUser from "@hooks/useUser";

import { SUPPORTED_CHAINS } from "../pages/_app";
import Section from "./Section";

export default function CheckConnected({ fullWidth = false }: { fullWidth?: boolean }) {
  const { isConnected } = useAccount();
  const { user } = useUser();
  const { open: openWeb3Modal } = useWeb3Modal();

  if (isConnected || !user?.isLoggedIn) {
    return null;
  }

  const Component = fullWidth ? Section : Box;

  // setDefaultChain(SUPPORTED_CHAINS[0]);

  return (
    <Component sx={{ p: 0, mb: 2, mt: 0 }}>
      <Alert
        severity="warning"
        action={
          <Button variant="outlined" color="warning" size="small" onClick={() => openWeb3Modal()}>
            Connect Wallet
          </Button>
        }
      >
        <AlertTitle>Reminder</AlertTitle>
        You are currently just connected through Odoo. Please connect your wallet for seamless interaction within the
        dapp.
      </Alert>
    </Component>
  );
}
