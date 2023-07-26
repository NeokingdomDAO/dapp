import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as leapWallets } from "@cosmos-kit/leap";
import { ChainProvider } from "@cosmos-kit/react";
import "@interchain-ui/react/styles";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { assets, chains } from "chain-registry";
import { NextPage } from "next";
import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { SnackbarProvider } from "notistack";
import { WagmiConfig, configureChains, createClient } from "wagmi";
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

export const SUPPORTED_CHAINS = [process.env.NEXT_PUBLIC_ENV === "staging" ? evmosTestnet : evmos];

// Wagmi client
const { provider } = configureChains(SUPPORTED_CHAINS, [
  w3mProvider({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID }),
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    version: 1,
    chains: SUPPORTED_CHAINS,
  }),
  provider,
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, SUPPORTED_CHAINS);

interface DappProps extends AppProps {
  Component: NextPage & {
    title: string;
    requireLogin?: boolean;
    renderOnServer?: boolean;
    fullWidth?: boolean;
    noLayout?: boolean;
    customCss?: string;
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

  const appElement = (
    <CssVarsProvider theme={newTheme} defaultMode="system">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <WagmiConfig client={wagmiClient}>
          <ChainProvider
            chains={[...chains]}
            assetLists={[...assets]}
            wallets={[...keplrWallets, ...leapWallets]}
            throwErrors={false}
            defaultNameService={"neokingdom"}
            logLevel={"DEBUG"}
            wrappedWithChakra={true} // required if `ChainProvider` is imported from `@cosmos-kit/react`
            walletConnectOptions={{
              signClient: {
                projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
                relayUrl: "wss://relay.walletconnect.org",
                metadata: {
                  name: "Neokingdom DAO",
                  description: "Neokingdom DAO dapp",
                  url: "https://dao.neokingdom.org/",
                  icons: [
                    "https://raw.githubusercontent.com/cosmology-tech/cosmos-kit/main/packages/docs/public/favicon-96x96.png",
                  ],
                },
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
                <Component {...pageProps} />
              ) : (
                <Layout fullWidth={!!Component.fullWidth}>
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
        projectId={process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID}
        ethereumClient={ethereumClient}
        themeVariables={{
          "--w3m-z-index": "2000",
        }}
      />
    </>
  );
}
