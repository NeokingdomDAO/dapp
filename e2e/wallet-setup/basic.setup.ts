import { MetaMask, defineWalletSetup } from "@synthetixio/synpress";

const SEED_PHRASE = "test test test test test test test test test test test junk";
const PASSWORD = "SynpressIsAwesomeNow!!!";

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const metamask = new MetaMask(context, walletPage, PASSWORD);

  await metamask.importWallet(SEED_PHRASE);

  await metamask.addNetwork({
    name: "Mumbai",
    rpcUrl: "https://rpc-mumbai.maticvigil.com",
    chainId: 80001,
    symbol: "MATIC",
  });
});
