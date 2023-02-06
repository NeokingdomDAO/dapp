import { useWeb3Modal } from "@web3modal/react";
import { decodeJwt } from "jose";
import Link from "next/link";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { shallow } from "zustand/shallow";

import * as React from "react";
import { useEffect } from "react";

import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import { Badge, Modal, Typography, useColorScheme, useTheme } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";

import { getLettersFromName } from "@lib/utils";

import useAlertStore from "@store/alertStore";
import useLoginModalStore from "@store/loginModal";

import useOdooUsers from "@hooks/useOdooUsers";
import useUser from "@hooks/useUser";

import LoginForm from "./LoginForm";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { md: 400, xs: "90%" },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function AccountMenu() {
  const { mode, setMode } = useColorScheme();
  const { user, mutateUser } = useUser();
  const { address, isConnected: walletConnected } = useAccount();
  const { data, isError, isLoading, isSuccess, signMessageAsync } = useSignMessage();

  const [mounted, setMounted] = React.useState(false);

  const isConnected = mounted && walletConnected;

  const theme = useTheme();

  const {
    users: [currentOdooUser],
  } = useOdooUsers(user?.ethereum_address);

  const { openAlert } = useAlertStore(
    (state) => ({
      openAlert: state.openAlert,
    }),
    shallow,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const { modalOpen, handleModalOpen, handleModalClose } = useLoginModalStore(
    (state) => ({
      modalOpen: state.isLoginModalOpen,
      handleModalOpen: state.handleOpenLoginModalFromLink,
      handleModalClose: state.closeLoginModal,
    }),
    shallow,
  );

  const logout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.status === 200) {
        mutateUser(await res.json());
      } else {
        openAlert({ message: "Logout failed" });
      }
    } catch (error) {
      openAlert({ message: "Network Error" });
    }
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const { open: openWeb3Modal } = useWeb3Modal();

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleConnectWallet = async () => {
    await openWeb3Modal();
    setAnchorEl(null);
  };

  const handleWalletLogin = async () => {
    const challenge = await fetch("/api/walletLogin", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const json = await challenge.json();
    console.log(json);
    const sig = await signMessageAsync({ message: json.message });
    console.log(sig);

    const response = await fetch("/api/walletLogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address,
        sig,
        signingToken: json.signingToken,
      }),
    });
    /*
    const q = await fetch("/api/graphql", {
      method: "POST",
      body: `
      query {
        AccountAnalyticLine(domain: [["user_id", "=", 12]]) {
            id,
            user_id {
                name
            },
            project_id {
                id,
                name
            },
            task_id {
                id,
                name
                },
            name,
            unit_amount,
        }
      }
      `,
    });
    console.log(await q.json());
    */
  };

  return (
    <React.Fragment>
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        slotProps={{
          backdrop: {
            style: {
              backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(4px)",
            },
          },
        }}
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            Log in
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            Use your odoo credentials to log in
          </Typography>
          <LoginForm onLoggedIn={handleModalClose} />
          <hr />
          <Button color="primary" onClick={handleWalletLogin}>
            Log in with your wallet
          </Button>
        </Box>
      </Modal>

      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Badge color="success" variant="dot" invisible={!isConnected}>
              {user?.isLoggedIn ? (
                <Avatar
                  sx={{ width: 32, height: 32 }}
                  alt={user?.display_name}
                  src={`data:image/jpeg;charset=utf-8;base64,${currentOdooUser?.image || ""}`}
                >
                  {getLettersFromName(user?.display_name)}
                </Avatar>
              ) : (
                <Avatar sx={{ width: 32, height: 32 }} />
              )}
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            bgcolor: "background.paper",
            backgroundImage: "none",
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {!user?.isLoggedIn && (
          <MenuItem href="/login" onClick={handleModalOpen} component={Link}>
            Login
          </MenuItem>
        )}
        {isConnected ? (
          <MenuItem onClick={() => openWeb3Modal()}>{`${address?.slice(0, 8)}...`}</MenuItem>
        ) : (
          <MenuItem onClick={handleConnectWallet}>Connect Wallet</MenuItem>
        )}
        {user?.isLoggedIn && [
          <Divider key="divider" />,
          <MenuItem onClick={handleClose} key="settings">
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>,
          <MenuItem onClick={logout} key="logout">
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>,
        ]}
        <Divider></Divider>
        <MenuItem onClick={() => setMode(mode === "light" ? "dark" : "light")}>
          Turn {mode === "light" ? "dark" : "light"}
          <IconButton sx={{ ml: 1 }} color="inherit">
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
