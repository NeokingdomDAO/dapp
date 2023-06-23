import { createTxRaw } from "@evmos/proto";
import {
  AccountResponse,
  generateEndpointAccount,
  generateEndpointBroadcast,
  generatePostBodyBroadcast,
} from "@evmos/provider";
import { Fee, IBCMsgTransferParams, Sender, TxContext, TxPayload, createTxIBCMsgTransfer } from "@evmos/transactions";
import { Long } from "cosmjs-types/helpers";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils.js";
import { EnqueueSnackbar } from "notistack";
import { SecretNetworkClient, stringToCoin } from "secretjs";

export const CHAIN_TO_ID = {
  evmos: "evmos_9001-2",
  crescent: "crescent-1",
} as const;

export const CHAIN_TO_NAME = {
  evmos: "EVMOS",
  crescent: "Crescent",
} as const;

export const OTHER_CHAIN = {
  evmos: "crescent",
  crescent: "evmos",
} as const;

export const COSMOS_NODE_URL = {
  evmos: "https://rest.cosmos.directory/evmos",
  crescent: "https://rest.cosmos.directory/crescent",
} as const;

export const DENOMS = {
  evmos: "erc20/0x655ecB57432CC1370f65e5dc2309588b71b473A9",
  crescent: "ibc/4DD3698C2FCEA87CDE843D3EA6228F2589A4DF6655A7C16D766010D9CA2E69FB",
} as const;

export type CosmosChains = keyof typeof CHAIN_TO_ID;

export const restOptions = {
  method: "GET",
  headers: { "Content-Type": "application/json" },
};

const getBalance = async () => {
  const chainId = CHAIN_TO_ID["crescent"];
  const url = COSMOS_NODE_URL["crescent"];

  const secretjs = new SecretNetworkClient({
    url,
    chainId,
  });

  const balance = await secretjs.query.bank.balance(
    {
      address: "cre1fy45cf4xh55wkyn6rfqxynsu8u7f9qhqrgscfu",
      denom: DENOMS["crescent"],
    } /*,
  // optional: query at a specific height (using an archive node) 
  [["x-cosmos-block-height", "2000000"]]
  */,
  );

  if (balance) {
    const value = BigNumber.from(balance.balance?.amount);
    console.log(`I have ${formatEther(value)} porcodio!`);
  }
};

export const sendFromCrescent = async (senderAddress: string, receiverAddress: string, amount: string) => {
  const chainId = CHAIN_TO_ID["crescent"];
  const url = COSMOS_NODE_URL["crescent"];
  if (!window.keplr) {
    return;
  }

  await window.keplr.enable(chainId);

  const keplrOfflineSigner = window.keplr.getOfflineSignerOnlyAmino(chainId);
  const [{ address: myAddress }] = await keplrOfflineSigner.getAccounts();

  const secretjs = new SecretNetworkClient({
    url,
    chainId,
    wallet: keplrOfflineSigner,
    walletAddress: myAddress,
    // Only used in Secret
    // encryptionUtils: window.keplr.getEnigmaUtils(chainId),
  });

  const tx = await secretjs.tx.ibc.transfer(
    {
      sender: senderAddress,
      receiver: receiverAddress,
      source_channel: "channel-7",
      source_port: "transfer",
      token: {
        amount,
        denom: DENOMS["crescent"],
      },
      timeout_timestamp: String(Math.floor(Date.now() / 1000) + 10 * 60), // 10 minutes
      memo: "Complaining is silly. Either act or forget",
    },
    {
      broadcastCheckIntervalMs: 100,
      gasLimit: 200_000,
      ibcTxsOptions: {
        resolveResponsesCheckIntervalMs: 250,
      },
    },
  );
  // https://www.mintscan.io/evmos/txs/2AF50D0BA7925878F24FD26D9ADE29B22A267D7AD27D5BC5A15ED296F55F89F7
  return { snackbarId: null, response: tx };
};

const fetchLastBlock = async (chain: CosmosChains) => {
  if (chain === "evmos") {
    // Make it dynamic
    return 13794606;
  } else {
    const rawResult = await fetch("https://rest.cosmos.directory/crescent/blocks/latest");
    const result = await rawResult.json();
    return parseInt(result.block.header.height);
  }
};

const fetchAccount = async (address: string, nodeUrl: string) => {
  // Find node urls for either mainnet or testnet here:
  // https://docs.evmos.org/develop/api/networks.
  const queryEndpoint = `${nodeUrl}${generateEndpointAccount(address)}`;

  console.log("🐞 > queryEndpoint:", queryEndpoint);
  // Note that the node will return a 400 status code if the account does not exist.
  const rawResult = await fetch(queryEndpoint, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!rawResult.ok) {
    console.log("error fetching account", rawResult);
  }
  const result = await rawResult.json();
  return result as AccountResponse;
};

// unable to resolve type URL /ethermint.crypto.v1.ethsecp256k1.PubKey: tx parse error
export const sendFromCrescent2 = async (senderAddress: string, receiverAddress: string, amount: string) => {
  const nodeUrl = COSMOS_NODE_URL["crescent"];

  console.log("Sending ", amount);
  const account = await fetchAccount(senderAddress, nodeUrl);
  console.log(account, Object.keys(account));
  let sender: Sender;

  sender = {
    accountAddress: senderAddress,
    // @ts-ignore
    sequence: parseInt(account.account.sequence),
    // @ts-ignore
    accountNumber: parseInt(account.account.account_number),
    // @ts-ignore
    pubkey: account.account.pub_key.key,
  };

  const fee: Fee = {
    amount: "1000000",
    denom: "ucre",
    gas: "2000000",
  };

  const memo = "";

  //const chain = nodeUrl === "crescent" ? chainCrescent : chainEvmos;

  const chain = {
    chainId: 1,
    cosmosChainId: "crescent-1",
  };

  const context: TxContext = {
    chain,
    sender,
    fee,
    memo,
  };

  const params: IBCMsgTransferParams = {
    // Connection
    sourcePort: "transfer",
    sourceChannel: "channel-7",
    // Token
    amount,
    denom: DENOMS["crescent"],
    // Addresses
    receiver: receiverAddress,
    // Timeout
    revisionNumber: 1,
    revisionHeight: (await fetchLastBlock("evmos")) + 100,
    timeoutTimestamp: (Date.now() + 600000).toString() + "000000",
  };

  const tx: TxPayload = createTxIBCMsgTransfer(context, params);
  const { signDirect } = tx;

  const signResponse = await window?.keplr?.signDirect(chain.cosmosChainId, sender.accountAddress, {
    bodyBytes: signDirect.body.toBinary(),
    authInfoBytes: signDirect.authInfo.toBinary(),
    chainId: chain.cosmosChainId,
    accountNumber: new Long(sender.accountNumber),
  });

  if (!signResponse) {
    console.log("user denied sig");
    return;
  }

  console.log("Tx signed");

  const signatures = [new Uint8Array(Buffer.from(signResponse.signature.signature, "base64"))];

  const { signed } = signResponse;

  const signedTx = createTxRaw(signed.bodyBytes, signed.authInfoBytes, signatures);

  console.log("Raw tx", signedTx);

  const postOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: generatePostBodyBroadcast(signedTx),
  };

  const broadcastEndpoint = `${nodeUrl}${generateEndpointBroadcast()}`;
  const broadcastPost = await fetch(broadcastEndpoint, postOptions);

  const response = await broadcastPost.json();

  console.log("broadcasted", response);
};

export const sendFromEvmos = async (
  senderAddress: string,
  receiverAddress: string,
  amount: string,
  enqueueSnackbar: EnqueueSnackbar,
) => {
  const nodeUrl = COSMOS_NODE_URL["evmos"];

  const account = await fetchAccount(senderAddress, nodeUrl);
  console.log("🐞 > account:", account);

  const sender: Sender = {
    accountAddress: senderAddress,
    sequence: parseInt(account.account.base_account.sequence),
    accountNumber: parseInt(account.account.base_account.account_number),
    pubkey: account.account.base_account.pub_key!.key,
  };

  const fee: Fee = {
    amount: "10000000",
    denom: "aevmos",
    gas: "200000",
  };

  const memo = "";

  const chain = {
    chainId: 9001,
    cosmosChainId: "evmos_9001-2",
  };

  const context: TxContext = {
    chain,
    sender,
    fee,
    memo,
  };

  const params: IBCMsgTransferParams = {
    // Connection
    sourcePort: "transfer",
    sourceChannel: "channel-11",
    // Token
    amount,
    denom: "erc20/0x655ecB57432CC1370f65e5dc2309588b71b473A9",
    // Addresses
    receiver: receiverAddress,
    // Timeout
    revisionNumber: 1,
    revisionHeight: (await fetchLastBlock("crescent")) + 100,
    timeoutTimestamp: (Date.now() + 600000).toString() + "000000",
  };

  const tx: TxPayload = createTxIBCMsgTransfer(context, params);
  const { signDirect } = tx;

  const signResponse = await window?.keplr?.signDirect(chain.cosmosChainId, sender.accountAddress, {
    bodyBytes: signDirect.body.toBinary(),
    authInfoBytes: signDirect.authInfo.toBinary(),
    chainId: chain.cosmosChainId,
    accountNumber: new Long(sender.accountNumber),
  });

  if (!signResponse) {
    throw new Error("User denied signature");
  }

  const snackbarId = enqueueSnackbar("Transaction in progress, please wait...", {
    variant: "info",
    autoHideDuration: 10000,
  });

  const signatures = [new Uint8Array(Buffer.from(signResponse.signature.signature, "base64"))];

  const { signed } = signResponse;

  const signedTx = createTxRaw(signed.bodyBytes, signed.authInfoBytes, signatures);

  const postOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: generatePostBodyBroadcast(signedTx),
  };

  const broadcastEndpoint = `${nodeUrl}${generateEndpointBroadcast()}`;
  const broadcastPost = await fetch(broadcastEndpoint, postOptions);

  const response = await broadcastPost.json();

  return { response, snackbarId };
};
