import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as leapWallets } from "@cosmos-kit/leap";
import { ChainProvider } from "@cosmos-kit/react";
import "@interchain-ui/react/styles";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { assets, chains } from "chain-registry";
import { NextPage } from "next";
import { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { SnackbarProvider } from "notistack";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { evmos, evmosTestnet } from "wagmi/chains";

import * as React from "react";
import { useEffect, useState } from "react";

import { Box, CircularProgress, CssBaseline, styled } from "@mui/material";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import CheckConnected from "@components/CheckConnected";
import Layout from "@components/Layout";

import useUser from "@hooks/useUser";

import ContractsProvider from "../components/ContractsProvider";
import { newTheme } from "../styles/theme";
import { META } from "./_document";

const ExtraneousWarning = dynamic(() => import("../components/ExtraneousWarning"), { ssr: false });

export const SUPPORTED_CHAINS = [process.env.NEXT_PUBLIC_ENV === "staging" ? evmosTestnet : evmos];

// Wagmi client
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
const { publicClient } = configureChains(SUPPORTED_CHAINS, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains: SUPPORTED_CHAINS }),
  publicClient,
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiConfig, SUPPORTED_CHAINS);

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
    <CssVarsProvider theme={newTheme} defaultMode="system">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <WagmiConfig config={wagmiConfig}>
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
                  <ExtraneousWarning />
                  <Component {...pageProps} />
                </>
              ) : (
                <Layout fullWidth={!!Component.fullWidth} checkMismatch={!!Component.checkMismatch}>
                  <ExtraneousWarning />
                  {(isLoading || !mounted) && (
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                      <CircularProgress />
                    </Box>
                  )}
                  {((mounted && !isLoading && !Component.requireLogin) || user?.isLoggedIn) && (
                    <ContractsProvider>
                      <>
                        <CheckConnected fullWidth={!!Component.fullWidth} />
                        <Component {...pageProps} />
                      </>
                    </ContractsProvider>
                  )}
                </Layout>
              )}
            </StyledSnackbarProvider>
          </ChainProvider>
        </WagmiConfig>
      </LocalizationProvider>
    </CssVarsProvider>
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
      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        themeVariables={{
          "--w3m-z-index": "2000",
        }}
      />
    </>
  );
}
