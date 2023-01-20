import React, { useMemo, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import HomeIcon from "@mui/icons-material/Home";
import ListItemText from "@mui/material/ListItemText";
import SettingsIcon from "@mui/icons-material/Settings";
import TaskIcon from "@mui/icons-material/Task";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { IconButton, Theme } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import useUser from "../lib/useUser";
import useAlertStore from "../store/alertStore";
import { shallow } from "zustand/shallow";

const drawerWidth = 240;

const initActiveStyle = (currentPath: string) => (href: string) =>
  currentPath === href ? { backgroundColor: (theme: Theme) => theme.palette.grey[300] } : {};

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, mutateUser } = useUser();
  const { isAlertOpen, alertMessage, alertSeverity, openAlert, closeAlert } = useAlertStore(
    (state) => ({
      isAlertOpen: state.open,
      alertMessage: state.message,
      alertSeverity: state.severity,
      openAlert: state.openAlert,
      closeAlert: state.closeAlert,
    }),
    shallow,
  );

  const router = useRouter();
  const getActiveStyle = useMemo(() => initActiveStyle(router.asPath), [router.asPath]);

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const logout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.status === 200) {
        const user = await res.json();
        mutateUser(user);
      } else {
        openAlert({ message: "Logout failed" });
      }
    } catch (error) {
      openAlert({ message: "Network Error" });
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/" sx={getActiveStyle("/")} onClick={handleDrawerToggle}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/tasks" sx={getActiveStyle("/tasks")} onClick={handleDrawerToggle}>
            <ListItemIcon>
              <TaskIcon />
            </ListItemIcon>
            <ListItemText primary="Tasks" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            href="/settings"
            sx={getActiveStyle("/settings")}
            onClick={handleDrawerToggle}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  const container = typeof window !== "undefined" ? document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Neokingdom DAO
          </Typography>
          {!user || !user.isLoggedIn ? (
            <Button component={Link} href="/login" color="inherit">
              Login
            </Button>
          ) : (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={() => logout()}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={isAlertOpen}
          onClose={closeAlert}
          key="alert-snackbar"
        >
          <Alert onClose={closeAlert} severity={alertSeverity} sx={{ width: "100%" }}>
            {alertMessage}
          </Alert>
        </Snackbar>
        {children}
      </Box>
    </Box>
  );
}
