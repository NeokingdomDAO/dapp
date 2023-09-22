import { useWeb3Modal } from "@web3modal/react";
import NextLink from "next/link";
import { useAccount, useBalance, useDisconnect, useNetwork } from "wagmi";

import { useState } from "react";

import { Alert, AlertTitle, Avatar, Box, Button, Divider, Link, Paper, Stack, Typography } from "@mui/material";

import { getLettersFromName } from "@lib/utils";

import Dialog from "@components/Dialog";

import useLogout from "@hooks/useLogout";
import useOdooUsers from "@hooks/useOdooUsers";
import useUser from "@hooks/useUser";

Settings.title = "Settings";
Settings.requireLogin = false;

const ISSUE_TEMPLATE = encodeURIComponent(`
## Problems with the dapp

### Description
- [ ] problem 1
- [ ] ...

### How to reproduce the bug
...

### App info, for the devs
${"```"}
Version: ${process.env.PACKAGE_VERSION}
Commit: ${process.env.LATEST_COMMIT_HASH}
${"```"}
`);

const DAPP_ISSUES_URL = "https://github.com/NeokingdomDAO/dapp/issues/new";
const COMMIT_URL = "https://github.com/NeokingdomDAO/dapp/commit";
const RELOAD_AFTER = 1000;

export default function Settings() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { logout } = useLogout();
  const { user } = useUser();
  const { isConnected: isWalletConnected, address } = useAccount();
  const { currentOdooUser } = useOdooUsers();
  const { chain } = useNetwork();
  const { data } = useBalance({
    address,
  });
  const { disconnect } = useDisconnect();
  const { open: openWeb3Modal } = useWeb3Modal();

  const resetDapp = async () => {
    const swRegistrations = await navigator.serviceWorker.getRegistrations();
    for (let registration of swRegistrations) {
      registration.unregister();
    }
    window.localStorage.clear();
    setDialogOpen(false);
    logout();
    window.setTimeout(() => window.location.reload(), RELOAD_AFTER);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <Dialog
        open={dialogOpen}
        handleClose={handleCloseDialog}
        handleApprove={resetDapp}
        descriptionId="dialog-approve-monthly"
        title="Heads up!"
      >
        <span>
          Are you sure you want to reinstall the dapp? This action will also log you out from odoo and will disconnect
          the wallet
        </span>
      </Dialog>
      <Typography variant="h3" sx={{ mb: 2 }}>
        Odoo settings
      </Typography>
      {!user?.isLoggedIn ? (
        <Link component={NextLink} href="/login?redirectTo=settings">
          Log in to view the settings
        </Link>
      ) : (
        <>
          <Stack
            direction="row"
            spacing={4}
            sx={{ mb: 2 }}
            divider={<Divider orientation="vertical" flexItem />}
            alignItems="center"
            justifyContent="center"
          >
            <Box>
              <Typography variant="body1">Name: {user?.display_name}</Typography>
              <Typography variant="body1">Email: {user?.email}</Typography>
            </Box>
            <Avatar
              sx={{ width: { xs: 64, sm: 124 }, height: { xs: 64, sm: 124 } }}
              alt={user?.display_name}
              src={`data:image/jpeg;charset=utf-8;base64,${currentOdooUser?.image || ""}`}
            >
              {getLettersFromName(user?.display_name)}
            </Avatar>
          </Stack>
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="outlined"
              size="small"
              href={`${process.env.NEXT_PUBLIC_ODOO_ENDPOINT}/web#id=16&cids=1&menu_id=77&action=231&model=res.users&view_type=form`}
              sx={{ mr: 2 }}
              target="_blank"
            >
              Edit on odoo
            </Button>
            <Button variant="outlined" size="small" onClick={() => logout()}>
              Log out from odoo
            </Button>
          </Box>
        </>
      )}
      <Divider sx={{ mb: 4, mt: 4 }} />
      <Typography variant="h3" sx={{ mb: 2 }}>
        Wallet settings
      </Typography>
      {!isWalletConnected ? (
        <>
          <Typography variant="body1">Connect your wallet to view the settings</Typography>
          <Button variant="outlined" color="warning" size="small" onClick={() => openWeb3Modal()} sx={{ mt: 2 }}>
            Connect Wallet
          </Button>
        </>
      ) : (
        <Box>
          <Typography variant="body1">Connected network: {chain?.name}</Typography>
          <Typography variant="body1">Balance: {data?.formatted}</Typography>
          <Button variant="outlined" size="small" onClick={() => disconnect()} sx={{ mt: 2 }}>
            Disconnect wallet
          </Button>
        </Box>
      )}
      <Divider sx={{ mb: 4, mt: 4 }} />
      <Alert severity="warning" sx={{ mb: 12 }}>
        <AlertTitle>Problems with the dapp?</AlertTitle>
        <Typography variant="body1" sx={{ mb: 2 }}>
          If you have any problems with the dapp, please either try to reinstall the dapp, or if that doesn&apos;t help,
          try to report the issue on discord or on github.
        </Typography>
        <Button color="primary" variant="outlined" onClick={handleOpenDialog} sx={{ mr: 2 }}>
          Reinstall the dapp
        </Button>
        <Button
          color="primary"
          variant="outlined"
          href={`${DAPP_ISSUES_URL}?title=Dapp bug&body=${ISSUE_TEMPLATE}&projects=NeokingdomDAO/1&labels=bug`}
          target="_blank"
        >
          Report an issue
        </Button>
      </Alert>
      <Paper
        sx={{
          marginTop: "calc(10% + 60px)",
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          p: 4,
          textAlign: "center",
        }}
        component="footer"
        square
        variant="outlined"
      >
        <Typography variant="body1">
          App Version: {process.env.PACKAGE_VERSION} - Build:{" "}
          <Link href={`${COMMIT_URL}/${process.env.LATEST_COMMIT_HASH}`} target="_blank">
            {process.env.LATEST_COMMIT_HASH}
          </Link>{" "}
        </Typography>
      </Paper>
    </>
  );
}
