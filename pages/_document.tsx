import Document, { Head, Html, Main, NextScript } from "next/document";
import { redHatFont } from "styles/theme";

import * as React from "react";

import { getInitColorSchemeScript } from "@mui/material";

export const META = {
  teledisko: {
    description: "Teledisko DAO description",
    title: "Teledisko DAO",
    keywords: "DAO, Teledisko, Blockchain",
  },
  neokingdom: {
    description:
      "Neokingdom DAO is an innovative Estonian company committed to developing a comprehensive ecosystem for legally compliant DAOs",
    title: "Neokingdom DAO",
    keywords: "DAO, NEOKINGDOM, Blockchain",
  },
  crowdpunk: {
    description: "Crowdpunk DAO. Setting new world records in web3",
    title: "Crowdpunk DAO",
    keywords: "DAO, Crowdpunk, Blockchain",
  },
  vanilla: {
    description: "Vanilla DAO. One dao to rule them all",
    title: "Vanilla DAO",
    keywords: "DAO, Vanilla, Blockchain",
  },
}[process.env.NEXT_PUBLIC_PROJECT_KEY];

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" className={redHatFont.className}>
        <Head>
          <link rel="shortcut icon" href={`/favicon-${process.env.NEXT_PUBLIC_PROJECT_KEY}.ico`} />
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="description" content={META.description} />
          <meta name="keywords" content={META.keywords} />
          <link rel="manifest" href={`/manifest-${process.env.NEXT_PUBLIC_PROJECT_KEY}.json`} />
          <style
            dangerouslySetInnerHTML={{
              __html: `
body {
  background-color: #FAFAFA;
}
[data-mui-color-scheme="dark"] body {
  background-color: #232323;
}

[data-mui-color-scheme="dark"] .editor-toolbar,
[data-mui-color-scheme="dark"] .editor-preview-full,
[data-mui-color-scheme="dark"] .CodeMirror {
  background-color: #232323 !important;
}

[data-mui-color-scheme="dark"] .editor-toolbar button:hover,
[data-mui-color-scheme="dark"] .editor-toolbar button.active {
  background-color: #000000 !important;
}

[data-mui-color-scheme="dark"] .editor-toolbar .fa:before {
  color: #FFFFFF !important;
}

[data-mui-color-scheme="dark"] .CodeMirror {
  color: #FFFFFF !important;
}

[data-mui-color-scheme="dark"] .CodeMirror .CodeMirror-cursor {
  border-color: #FFFFFF !important;
}
`,
            }}
          />
        </Head>
        <body>
          {getInitColorSchemeScript({ defaultMode: "system" })}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
