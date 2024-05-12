import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { assets, chains } from "chain-registry";
import { NextPage } from "next";
import { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { SnackbarProvider } from "notistack";
import { WagmiProvider } from "wagmi";
import { evmos, polygonMumbai } from "wagmi/chains";

import * as React from "react";
import { useEffect, useState } from "react";

import { Box, CircularProgress, CssBaseline, styled } from "@mui/material";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { FeatureFlagContextProvider } from "@lib/feature-flags/useFeatureFlags";

import CheckNeokBalance from "@components/CeckNeokBalance";
import CheckConnected from "@components/CheckConnected";
import Layout from "@components/Layout";

import useUser from "@hooks/useUser";

import ContractsProvider from "../components/ContractsProvider";
import VercelTools from "../components/VercelTools";
import { newTheme } from "../styles/theme";
import { META } from "./_document";

// @ts-ignore
const ExtraneousWarning = dynamic(() => import("../components/ExtraneousWarning"), {
  ssr: false,
});

const evmosLava = {
  ...evmos,
  rpcUrls: {
    default: {
      http: ["https://evmos.lava.build"],
    },
    public: {
      http: ["https://evmos.lava.build"],
    },
  },
};

export const SUPPORTED_CHAINS = [process.env.NEXT_PUBLIC_ENV === "staging" ? polygonMumbai : evmosLava];

// Wagmi client
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
const queryClient = new QueryClient();
const metadata = {
  name: "Web3Modal",
  description: "Web3Modal for Solidato",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const wagmiConfig = defaultWagmiConfig({
  chains: [process.env.NEXT_PUBLIC_ENV === "staging" ? polygonMumbai : evmosLava],
  projectId,
  metadata,
  enableCoinbase: false,
  ssr: true,
});

createWeb3Modal({
  wagmiConfig,
  projectId,
  featuredWalletIds: [
    // 'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
    "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // Trust Wallet
    "3ed8cc046c6211a798dc5ec70f1302b43e07db9639fd287de44a9aa115a21ed6", // Leap Cosmos Wallet
    "6adb6082c909901b9e7189af3a4a0223102cd6f8d5c39e39f3d49acb92b578bb", // Keplr Wallet
  ],
  themeVariables: {
    "--w3m-z-index": 2000,
  },
});

interface DappProps extends AppProps {
  Component: NextPage & {
    title: string;
    requireLogin?: boolean;
    renderOnServer?: boolean;
    fullWidth?: boolean;
    noLayout?: boolean;
    customCss?: string;
    checkMismatch?: string;
  };
  pageProps: any;
}

const StyledSnackbarProvider = styled(SnackbarProvider)`
  &.SnackbarItem-contentRoot {
    margin-top: 53px;
  }
`;

export default function App({ Component, pageProps }: DappProps) {
  const pageTitle = Component.title ? `${META.title} | ${Component.title}` : META.title;
  const { asPath } = useRouter();
  const [mounted, setMounted] = useState(!!Component.renderOnServer);

  const { isLoading, user } = useUser({
    redirectTo: `/login?redirectTo=${encodeURIComponent(asPath)}`,
    shouldSkip: !Component.requireLogin,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const appElement = (
    <FeatureFlagContextProvider email={user?.email} walletAddress={user?.ethereum_address} erpId={user?.id.toString()}>
      <CssVarsProvider theme={newTheme} defaultMode="system">
        <VercelTools />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
              <StyledSnackbarProvider
                maxSnack={3}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                preventDuplicate
              >
                <CssBaseline />
                {Component.noLayout ? (
                  <>
                    <ExtraneousWarning>
                      <Component {...pageProps} />
                    </ExtraneousWarning>
                  </>
                ) : (
                  <Layout fullWidth={!!Component.fullWidth} checkMismatch={!!Component.checkMismatch}>
                    <ExtraneousWarning>
                      {(isLoading || !mounted) && (
                        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                          <CircularProgress />
                        </Box>
                      )}
                      {((mounted && !isLoading && !Component.requireLogin) || user?.isLoggedIn) && (
                        <ContractsProvider>
                          <>
                            <CheckNeokBalance />
                            <CheckConnected fullWidth={!!Component.fullWidth} />
                            <Component {...pageProps} />
                          </>
                        </ContractsProvider>
                      )}
                    </ExtraneousWarning>
                  </Layout>
                )}
              </StyledSnackbarProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </LocalizationProvider>
      </CssVarsProvider>
    </FeatureFlagContextProvider>
  );

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        {Component.customCss && <style>{Component.customCss}</style>}
      </Head>
      {appElement}
    </>
  );
}
