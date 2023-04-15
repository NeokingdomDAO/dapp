import { useWeb3Modal } from "@web3modal/react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { shallow } from "zustand/shallow";

import { useState } from "react";

import { Alert, Chip, Divider } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import useLoginModalStore from "@store/loginModal";

import { useSnackbar } from "@hooks/useSnackbar";
import useUser from "@hooks/useUser";

export default function LoginForm({ onLoggedIn }: { onLoggedIn?: () => void }) {
  const { query } = useRouter();
  const { open: openWeb3Modal } = useWeb3Modal();
  const { enqueueSnackbar } = useSnackbar();
  const [openLoginForm, setOpenLoginForm] = useState(false);

  const { isConnected } = useAccount();

  const { mutateUser, user: sessionUser } = useUser(
    !onLoggedIn
      ? {
          redirectTo: String(query?.redirectTo || "/"),
          redirectIfFound: true,
        }
      : {},
  );

  const { setIsReadyToSign, openLoginModal } = useLoginModalStore(
    (state) => ({
      setIsReadyToSign: state.setIsReadyToSign,
      openLoginModal: state.openLoginModal,
    }),
    shallow,
  );

  const connectedButLoggedOut = !sessionUser?.isLoggedIn && isConnected;

  const [user, setUser] = useState<{ username: string; password: string }>({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...user }),
    });
    if (res.status === 200) {
      mutateUser();
      onLoggedIn && onLoggedIn();
    } else {
      enqueueSnackbar("Login Failed: Your email or password is incorrect", { variant: "error" });
    }
    setIsLoading(false);
  };

  return (
    <>
      {!openLoginForm && (
        <>
          {connectedButLoggedOut ? (
            <Button
              variant="contained"
              onClick={() => {
                setIsReadyToSign(true);
                openLoginModal();
              }}
              fullWidth
              size="large"
              sx={{ mt: 8, mb: 8 }}
            >
              Sign in to odoo via wallet
            </Button>
          ) : (
            <Button variant="contained" onClick={() => openWeb3Modal()} fullWidth size="large">
              Connect wallet
            </Button>
          )}
          <Divider sx={{ pt: 4, mb: 4 }}>
            <Chip label="Or" />
          </Divider>
          <Alert severity="info" sx={{ mb: 2 }}>
            If you don&apos;t have your wallet, you can still log in with your Odoo username and password. Bear in mind
            you will be only able to use functionalities that don&apos;t require a wallet.
          </Alert>
        </>
      )}
      <Button variant="outlined" onClick={() => setOpenLoginForm((old) => !old)} fullWidth>
        {openLoginForm ? "Close form" : "Log in via username and password"}
      </Button>
      {openLoginForm && (
        <Box component="form" onSubmit={onSubmit} autoComplete="off">
          <Box sx={{ mt: 3 }}>
            <TextField
              required
              id="odoo-uname"
              name="odoo-uname"
              label="Odoo username"
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              value={user.username}
              fullWidth
              autoFocus
            />
          </Box>
          <Box sx={{ mt: 2, mb: 2 }}>
            <TextField
              required
              id="odoo-pwd"
              name="odoo-pwd"
              type="password"
              label="Odoo Password"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              value={user.password}
              fullWidth
            />
          </Box>
          <Button type="submit" variant="contained" size="large" fullWidth disabled={isLoading}>
            Login
          </Button>
        </Box>
      )}
    </>
  );
}
