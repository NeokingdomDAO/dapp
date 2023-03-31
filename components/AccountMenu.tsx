import Link from "next/link";
import { useAccount } from "wagmi";
import { shallow } from "zustand/shallow";

import * as React from "react";
import { useEffect } from "react";

import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Logout from "@mui/icons-material/Logout";
import { Badge, useColorScheme } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";

import { getLettersFromName } from "@lib/utils";

import useLoginModalStore from "@store/loginModal";

import useLogout from "@hooks/useLogout";
import useOdooUsers from "@hooks/useOdooUsers";
import useUser from "@hooks/useUser";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { md: 400, xs: "90%" },
  bgcolor: "background.paper",
  boxShadow: 24,
  textAlign: "center",
  p: 4,
};

export default function AccountMenu() {
  const { mode, setMode } = useColorScheme();
  const { user } = useUser();
  const { logout } = useLogout();

  const { isConnected: isWalletConnected } = useAccount();

  const [mounted, setMounted] = React.useState(false);
  const isConnected = mounted && isWalletConnected;

  const {
    users: [currentOdooUser],
  } = useOdooUsers(user?.ethereum_address);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { handleModalOpen } = useLoginModalStore(
    (state) => ({
      handleModalOpen: state.handleOpenLoginModalFromLink,
    }),
    shallow,
  );

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
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
        <MenuItem href="/settings" component={Link}>
          Settings
        </MenuItem>
        {(user?.isLoggedIn || isConnected) && [
          <Divider key="divider" />,
          user?.isLoggedIn ? (
            <MenuItem onClick={() => logout()} key="logout">
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          ) : (
            <MenuItem onClick={() => logout()} key="logout">
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Disconnect wallet
            </MenuItem>
          ),
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
