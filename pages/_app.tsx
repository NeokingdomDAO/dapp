import Head from "next/head";
import { NextPage } from "next";
import { AppProps } from "next/app";
import { Box, CircularProgress, ThemeProvider } from "@mui/material";
import { theme } from "../styles/theme";
import Layout from "../components/Layout";
import useUser from "../lib/useUser";

interface DappProps extends AppProps {
  Component: NextPage & {
    title: string;
    requireLogin?: boolean;
  };
}

export default function App({ Component, pageProps }: DappProps) {
  const pageTitle = Component.title ? `NeokingdomDAO | ${Component.title}` : "NeokingdomDAO";
  const { isLoading, user } = useUser({ redirectTo: "/login", shouldSkip: !Component.requireLogin });

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content="Description" />
        <meta name="keywords" content="Keywords" />

        <link rel="manifest" href="/manifest.json" />
        <link href="/icons/favicon-16x16.png" rel="icon" type="image/png" sizes="16x16" />
        <link href="/icons/favicon-32x32.png" rel="icon" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-icon.png"></link>
        <meta name="theme-color" content="#317EFB" />
      </Head>
      <ThemeProvider theme={theme}>
        <Layout>
          {isLoading && (
            <Box sx={{ width: "100%", display: "flex", justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          )}
          {((!isLoading && !Component.requireLogin) || user?.isLoggedIn) && <Component {...pageProps} />}
        </Layout>
      </ThemeProvider>
    </>
  );
}
