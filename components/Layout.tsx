import dynamic from "next/dynamic";
import { Stardos_Stencil } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import React, { useMemo } from "react";

import { Badge, Chip, Container, Divider, Slide, Stack, useScrollTrigger } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

import { useCheckSubgraphState } from "@hooks/useCheckSubgraphState";
import useGetActiveResolutions from "@hooks/useGetActiveResolutions";
import useUser from "@hooks/useUser";

import useDelegationStatus from "../hooks/useDelegationStatus";
import CrowdpunkLogo from "../images/logo-crowdpunk.png";
import TelediskoLogo from "../images/logo-teledisko.png";
import AccountMenu from "./AccountMenu";
import LoginModal from "./LoginModal";
import MismatchNotifier from "./mismatch-notifier/MismatchNotifier";
import NkdLogo from "./svg-logos/NkdLogo";

const stardosStencil = Stardos_Stencil({
  weight: "700",
  subsets: ["latin"],
});

const initActiveStyle = (currentPath: string) => (href: string) =>
  currentPath === href || (href !== "/" && currentPath.startsWith(href));

const TimeEntryWidget = dynamic(() => import("./time-entry/TimeEntry"), { ssr: false });

export default function Layout({
  children,
  fullWidth = false,
  checkMismatch = false,
}: {
  children: React.ReactNode;
  fullWidth?: boolean;
  checkMismatch?: boolean;
}) {
  const { user } = useUser();
  const router = useRouter();
  const { shouldNotifyMismatch } = useCheckSubgraphState();
  const trigger = useScrollTrigger();
  const isActive = useMemo(() => initActiveStyle(router.asPath), [router.asPath]);
  const { data } = useDelegationStatus();
  const { votingResolutions } = useGetActiveResolutions();
  const votingResolutionsNum = votingResolutions?.length || 0;

  const delegationActive = data.signerDelegatedBy.length > 0 || data.signerDelegationStatus?.isDelegating;

  const LOGO = {
    neokingdom: <NkdLogo height={70} />,
    teledisko: <Image height={35} src={TelediskoLogo} alt="Teledisko DAO" />,
    crowdpunk: (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "1px solid rgb(237, 89, 203)",
            overflow: "hidden",
          }}
        >
          <Image width={40} height={40} src={CrowdpunkLogo} alt="Crowdpunk DAO" />
        </Box>
        <Box sx={{ ml: 1, fontSize: "1.8rem", color: "rgb(237, 89, 203)" }} className={stardosStencil.className}>
          CROWDPUNK
        </Box>
      </Box>
    ),
  };

  return (
    <>
      {checkMismatch && <MismatchNotifier />}
      <LoginModal />
      {user?.isLoggedIn && <TimeEntryWidget />}
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
          "@media print": {
            display: "none",
            "+ main": {
              pt: 2,
            },
          },
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
              <Link href="/" style={{ display: "flex", height: 70, alignItems: "center", textDecoration: "none" }}>
                {LOGO[process.env.NEXT_PUBLIC_PROJECT_KEY]}
              </Link>
              <Box sx={{ ml: "auto" }}>
                <AccountMenu />
              </Box>
            </Toolbar>
          </Slide>
          <Divider />
          <Toolbar
            variant="dense"
            sx={{
              position: "relative",
              "&:after": {
                content: '""',
                position: "absolute",
                right: 16,
                top: 0,
                width: 50,
                height: "100%",
                pointerEvents: "none",
                background: "linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,1) 100%)",
                ['[data-mui-color-scheme="dark"] &']: {
                  background: "linear-gradient(to right, rgba(33,33,33,0), rgba(33,33,33,1) 100%)",
                },
              },
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{
                position: "relative",
                overflow: "auto",
                "&::-webkit-scrollbar": { display: "none" },
                msOverflowStyle: "none",
                scrollbarWidth: "none",
                pr: "30px",
              }}
            >
              {user?.isLoggedIn && (
                <Chip
                  label="Dashboard"
                  component={Link}
                  href="/"
                  variant={isActive("/") ? "filled" : "outlined"}
                  clickable
                />
              )}

              {user?.isLoggedIn && (
                <Chip
                  label="Tasks"
                  component={Link}
                  href="/tasks"
                  variant={isActive("/tasks") ? "filled" : "outlined"}
                  clickable
                />
              )}

              <Badge
                color="success"
                sx={{
                  "& .MuiBadge-badge": {
                    top: 10,
                    right: 3,
                    border: "2px solid #FFF",
                    ['[data-mui-color-scheme="dark"] &']: {
                      border: "2px solid #121212",
                    },
                    padding: "0 4px",
                  },
                }}
                badgeContent={votingResolutionsNum}
                invisible={votingResolutionsNum === 0}
                variant="standard"
              >
                <Chip
                  label="Resolutions"
                  component={Link}
                  href="/resolutions"
                  variant={isActive("/resolutions") ? "filled" : "outlined"}
                  clickable
                />
              </Badge>

              {user?.isLoggedIn && (
                <Chip
                  label="Tokens & Offers"
                  component={Link}
                  href="/tokens-offers"
                  variant={isActive("/tokens-offers") ? "filled" : "outlined"}
                  clickable
                />
              )}

              {typeof window !== "undefined" && user?.isLoggedIn && (
                <Badge
                  color="success"
                  sx={{
                    "& .MuiBadge-badge": {
                      top: 10,
                      right: 3,
                      ...(!data.signerDelegationStatus?.isDelegating && {
                        border: (t) => `2px solid ${t.palette.background.paper}`,
                        padding: "0 4px",
                      }),
                    },
                  }}
                  badgeContent={data?.signerDelegatedBy?.length || "1"}
                  invisible={!delegationActive}
                  variant={data?.signerDelegationStatus?.isDelegating ? "dot" : "standard"}
                >
                  <Chip
                    label="Delegation"
                    component={Link}
                    href="/delegation"
                    variant={isActive("/delegation") ? "filled" : "outlined"}
                    clickable
                  />
                </Badge>
              )}

              <Chip
                label="Shareholders"
                component={Link}
                href="/shareholders"
                variant={isActive("/shareholders") ? "filled" : "outlined"}
                clickable
              />

              <Chip
                label="IBC tools"
                component={Link}
                href="/ibc"
                variant={isActive("/ibc") ? "filled" : "outlined"}
                clickable
              />
            </Stack>
          </Toolbar>
        </AppBar>
      </Box>
      <Box
        component="main"
        sx={{
          p: { md: fullWidth ? 0 : 3 },
          ...((shouldNotifyMismatch || user?.isLoggedIn) && {
            pb: { xs: 12, md: 12 },
          }),
          pt: { xs: fullWidth ? 15 : 18, md: 18 },
        }}
      >
        {fullWidth ? children : <Container maxWidth="lg">{children}</Container>}
      </Box>
    </>
  );
}
