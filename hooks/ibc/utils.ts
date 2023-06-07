import { createTxRaw } from "@evmos/proto";
import {
  AccountResponse,
  generateEndpointAccount,
  generateEndpointBroadcast,
  generatePostBodyBroadcast,
} from "@evmos/provider";
import { Fee, IBCMsgTransferParams, Sender, TxContext, TxPayload, createTxIBCMsgTransfer } from "@evmos/transactions";
import { Long } from "cosmjs-types/helpers";

export const CHAIN_TO_ID = {
  evmos: "evmos_9001-2",
  crescent: "crescent-1",
} as const;

export const CHAIN_TO_NAME = {
  evmos: "EVMOS",
  crescent: "Crescent",
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

const fetchLastBlockCrescent = async () => {
  const rawResult = await fetch("https://rest.cosmos.directory/crescent/blocks/latest");
  const result = await rawResult.json();
  return parseInt(result.block.header.height);
};

const fetchAccount = async (address: string, nodeUrl: string) => {
  // Find node urls for either mainnet or testnet here:
  // https://docs.evmos.org/develop/api/networks.
  const queryEndpoint = `${nodeUrl}${generateEndpointAccount(address)}`;

  const restOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  // Note that the node will return a 400 status code if the account does not exist.
  const rawResult = await fetch(queryEndpoint, restOptions);

  const result = await rawResult.json();
  return result as AccountResponse;
};

export const sendFromEvmos = async (senderAddress: string, receiverAddress: string, amount: string) => {
  const nodeUrl = COSMOS_NODE_URL["evmos"];

  console.log("Sending ", amount);
  const account = await fetchAccount(senderAddress, nodeUrl);
  console.log(account, Object.keys(account));
  let sender: Sender;

  sender = {
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

  //const chain = nodeUrl === "crescent" ? chainCrescent : chainEvmos;

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
    revisionHeight: (await fetchLastBlockCrescent()) + 100,
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
