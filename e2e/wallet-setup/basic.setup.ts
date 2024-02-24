import { MetaMask, defineWalletSetup } from "@synthetixio/synpress";
import "dotenv/config";

const DEFAULT_SEED_PHRASE = "test test test test test test test test test test test junk";
const PASSWORD = "SynpressIsAwesomeNow!!!";

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  // @ts-ignore Library still in alpha, types need to improve
  const metamask = new MetaMask(context, walletPage, PASSWORD);

  await metamask.importWallet(process.env.E2E_WALLET_ENDPOINT || DEFAULT_SEED_PHRASE);

  await metamask.addNetwork({
    name: "Mumbai",
    rpcUrl: "https://rpc-mumbai.maticvigil.com",
    chainId: 80001,
    symbol: "MATIC",
  });
});
