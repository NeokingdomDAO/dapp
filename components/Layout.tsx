import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import React, { useMemo } from "react";

import { Chip, Container, Divider, Slide, Stack, useScrollTrigger } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";

import TelediskoLogo from "../images/logo-teledisko.png";
import AccountMenu from "./AccountMenu";
import NkdLogo from "./svg-logos/NkdLogo";

const initActiveStyle = (currentPath: string) => (href: string) => currentPath === href;

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const trigger = useScrollTrigger();
  const isActive = useMemo(() => initActiveStyle(router.asPath), [router.asPath]);

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          ['[data-mui-color-scheme="dark"] &']: {
            backgroundColor: "rgba(33, 33, 33, 0.9)",
          },
          backdropFilter: "blur(4px)",
          position: "fixed",
          width: "100%",
          zIndex: 2,
          isolation: "isolate",
          transition: "transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
          transform: trigger ? "translate3d(0, -71px, 0)" : "translate3d(0, 0, 0)",
        }}
      >
        <AppBar position="relative" elevation={0} variant="outlined" color="transparent">
          <Slide appear={false} direction="down" in={!trigger}>
            <Toolbar
              sx={{
                "& svg": { fill: "#000000" },
                ['[data-mui-color-scheme="dark"] &']: {
                  "& svg": { fill: "#FFFFFF" },
                },
              }}
            >
              <Link href="/" style={{ display: "flex", height: 70, alignItems: "center" }}>
                {process.env.NEXT_PUBLIC_PROJECT_KEY === "neokingdom" && <NkdLogo height={70} />}
                {process.env.NEXT_PUBLIC_PROJECT_KEY === "teledisko" && (
                  <Image height={35} src={TelediskoLogo} alt="Teledisko DAO" />
                )}
              </Link>
              <Box sx={{ ml: "auto" }}>
                <AccountMenu />
              </Box>
            </Toolbar>
          </Slide>
          <Divider />
          <Toolbar variant="dense">
            <Stack direction="row" spacing={1} sx={{ overflow: "auto" }}>
              <Chip
                label="Dashboard"
                component={Link}
                href="/"
                variant={isActive("/") ? "filled" : "outlined"}
                clickable
              />
              <Chip
                label="Resolutions"
                component={Link}
                href="/resolutions"
                variant={isActive("/resolutions") ? "filled" : "outlined"}
                clickable
              />
              <Chip
                label="Tasks"
                component={Link}
                href="/tasks"
                variant={isActive("/tasks") ? "filled" : "outlined"}
                clickable
              />
              <Chip
                label="Shareholders"
                component={Link}
                href="/shareholders"
                variant={isActive("/shareholders") ? "filled" : "outlined"}
                clickable
              />
            </Stack>
          </Toolbar>
        </AppBar>
      </Box>
      <Box component="main" sx={{ p: { md: 3 }, pt: { xs: 18, md: 18 } }}>
        <Container maxWidth="lg">{children}</Container>
      </Box>
    </>
  );
}
