import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as leapWallets } from "@cosmos-kit/leap";
import { ChainProvider } from "@cosmos-kit/react";
import "@interchain-ui/react/styles";
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
import { evmos, polygonMumbai } from "viem/chains";
import { WagmiProvider } from "wagmi";

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

const overriddenEvmos: typeof evmos = {
  id: 9001,
  name: "Evmos",
  network: "evmos",
  nativeCurrency: {
    decimals: 18,
    name: "Evmos",
    symbol: "EVMOS",
  },
  rpcUrls: {
    default: {
      // @ts-ignore
      http: ["https://evmos.lava.build"],
    },
    public: {
      // @ts-ignore
      http: ["https://evmos.lava.build"],
    },
  },
  blockExplorers: {
    default: {
      name: "Evmos Block Explorer",
      url: "https://escan.live",
    },
  },
};

export const SUPPORTED_CHAINS = [process.env.NEXT_PUBLIC_ENV === "staging" ? polygonMumbai : overriddenEvmos];

// Wagmi client
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const queryClient = new QueryClient();

const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Neokingdom DAO",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const wagmiConfig = defaultWagmiConfig({
  // @ts-ignore not sure how to make ts happy here
  chains: SUPPORTED_CHAINS,
  projectId,
  metadata,
  enableCoinbase: false,
  ssr: true,
});

createWeb3Modal({
  wagmiConfig,
  projectId,
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
    redirectTo: `/login?redirectTo=${asPath}`,
    shouldSkip: !Component.requireLogin,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const SUPPORTED_CHAINS = ["evmos", "crescent"];
  const supportedChains = chains.filter((chain) => SUPPORTED_CHAINS.includes(chain.chain_name));
  const supportedAssets = assets.filter((asset) => SUPPORTED_CHAINS.includes(asset.chain_name));

  const appElement = (
    <FeatureFlagContextProvider email={user?.email} walletAddress={user?.ethereum_address} erpId={user?.id.toString()}>
      <CssVarsProvider theme={newTheme} defaultMode="system">
        <VercelTools />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
              <ChainProvider
                chains={supportedChains}
                assetLists={supportedAssets}
                wallets={[...keplrWallets, ...leapWallets]}
                logLevel={"DEBUG"}
                walletConnectOptions={{
                  // Required if "wallets" contains mobile wallets
                  signClient: {
                    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
                  },
                }}
              >
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
              </ChainProvider>
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
