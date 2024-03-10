namespace NodeJS {
  interface ProcessEnv {
    ODOO_WEB_LOGIN_ENDPOINT: string;
    ODOO_JWT_TOKEN_ENDPOINT: string;
    ODOO_GRAPHQL_ENDPOINT: string;
    NEXT_PUBLIC_ODOO_ENDPOINT: string;
    NEXT_PUBLIC_PROJECT_KEY: "neokingdom" | "teledisko" | "crowdpunk" | "vanilla";
    NEXT_PUBLIC_GRAPHQL_ENDPOINT: string;
    NEXT_PUBLIC_LEGACY_GRAPHQL_ENDPOINT?: string;
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: string;
    NEXT_PUBLIC_IPFS_ENDPOINT: string;
    NEXT_PUBLIC_ENV: "staging" | "production";
    COOKIE_NAME: string;
    COOKIE_PASSWORD: string;
    E2E_WALLET_ENDPOINT: string;
    E2E_ODOO_USERNAME: string;
    E2E_ODOO_PASSWORD: string;
    NEXT_PUBLIC_HYPERTUNE_TOKEN: string;
    HYPERTUNE_OUTPUT_FILE_PATH: string;
  }
}
