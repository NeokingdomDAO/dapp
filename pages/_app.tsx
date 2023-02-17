import { EthereumClient, modalConnectors, walletConnectProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { NextPage } from "next";
import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { SnackbarProvider } from "notistack";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { evmos, evmosTestnet } from "wagmi/chains";

import * as React from "react";
import { useEffect, useState } from "react";

import { Box, CircularProgress } from "@mui/material";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";

import Layout from "@components/Layout";

import useUser from "@hooks/useUser";

import ContractsProvider from "../components/ContractsProvider";
import { newTheme } from "../styles/theme";
import { META } from "./_document";

const chains = [process.env.NEXT_PUBLIC_ENV === "staging" ? evmosTestnet : evmos];

// Wagmi client
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID }),
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    version: "2",
    appName: "web3Modal",
    chains,
  }),
  provider,
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);

interface DappProps extends AppProps {
  Component: NextPage & {
    title: string;
    requireLogin?: boolean;
    renderOnServer?: boolean;
  };
}

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
      <WagmiConfig client={wagmiClient}>
        <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
          <Layout>
            {(isLoading || !mounted) && (
              <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            )}
            {((mounted && !isLoading && !Component.requireLogin) || user?.isLoggedIn) && (
              <ContractsProvider>
                <Component {...pageProps} />
              </ContractsProvider>
            )}
          </Layout>
        </SnackbarProvider>
      </WagmiConfig>
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
      </Head>
      {appElement}
      <Web3Modal projectId={process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID} ethereumClient={ethereumClient} />
    </>
  );
}
