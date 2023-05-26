import { evmosToEth } from "@evmos/address-converter";
import { createMsgConvertERC20, createTxRaw } from "@evmos/proto";
import {
  AccountResponse,
  BalanceByDenomResponse,
  generateEndpointAccount,
  generateEndpointBalanceByDenom,
  generateEndpointBroadcast,
  generatePostBodyBroadcast,
} from "@evmos/provider";
import {
  Chain,
  Fee,
  IBCMsgTransferParams,
  MsgConvertERC20Params,
  MsgSendParams,
  Sender,
  TxContext,
  TxPayload,
  createTxIBCMsgTransfer,
  createTxMsgConvertERC20,
  createTxMsgSend,
} from "@evmos/transactions";
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { Long } from "cosmjs-types/helpers";
import { formatEther, parseEther } from "ethers/lib/utils.js";

import { useState } from "react";

import { Button, Grid, Paper, Typography } from "@mui/material";

const chain: Chain = {
  chainId: 9001,
  cosmosChainId: "evmos_9001-2",
};

declare global {
  interface Window extends KeplrWindow {}
}

export interface TokenPairResponse {
  token_pairs: [
    {
      erc20_address: string;
      denom: string;
      enabled: boolean;
      contract_owner: string;
    },
  ];
}

const nodeUrl = "https://rest.cosmos.directory/evmos";
const restOptions = {
  method: "GET",
  headers: { "Content-Type": "application/json" },
};

const fetchBalanceByDenom = async (address: string, denom: string) => {
  const queryEndpoint = `${nodeUrl}${generateEndpointBalanceByDenom(address, denom)}`;
  const rawResult = await fetch(queryEndpoint, restOptions);

  const result = (await rawResult.json()) as BalanceByDenomResponse;

  return result;
};

const fetchERC20ContractAddress = async () => {
  const queryEndpoint = `${nodeUrl}/evmos/erc20/v1/token_pairs`;
  const rawResult = await fetch(queryEndpoint, restOptions);

  const result = (await rawResult.json()) as TokenPairResponse;

  return result;
};

const fetchAddress = async () => {
  const cosmosChainID = "evmos_9001-2"; // Use 'evmos_9000-4' for testnet
  const account = await window?.keplr?.getKey(cosmosChainID);
  if (account) {
    const pk = Buffer.from(account.pubKey).toString("base64");
    return account.bech32Address;
  }
};

const fetchAccount = async (address: string) => {
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

const convertERC20 = async (senderAddress: string) => {
  const senderHexAddress = evmosToEth(senderAddress);
  const account = await fetchAccount(senderAddress);
  const sender: Sender = {
    accountAddress: senderAddress,
    sequence: parseInt(account.account.base_account.sequence),
    accountNumber: parseInt(account.account.base_account.account_number),
    pubkey: account.account.base_account.pub_key!.key,
  };

  const fee: Fee = {
    amount: "10000000",
    denom: "aevmos",
    gas: "5000000",
  };

  const memo = "";

  const context: TxContext = {
    chain,
    sender,
    fee,
    memo,
  };

  const params: MsgConvertERC20Params = {
    contractAddress: "0x655ecB57432CC1370f65e5dc2309588b71b473A9",
    amount: parseEther("1").toString(),
    // Addresses
    receiverBech32: senderAddress,
    senderHex: senderHexAddress,
  };

  const tx: TxPayload = createTxMsgConvertERC20(context, params);
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

const sendIBC = async (senderAddress: string) => {
  const account = await fetchAccount(senderAddress);
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
    amount: parseEther("0.1").toString(),
    denom: "erc20/0x655ecB57432CC1370f65e5dc2309588b71b473A9",
    // Addresses
    receiver: "cre1fy45cf4xh55wkyn6rfqxynsu8u7f9qhqrgscfu",
    // Timeout
    revisionNumber: 1,
    revisionHeight: 6700000,
    timeoutTimestamp: "1687777059000000000",
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

export default function IBC() {
  const [address, setAddress] = useState<string | undefined>();
  const [balance, setBalance] = useState<string | undefined>();

  const handleConnect = async () => {
    const address = await fetchAddress();
    if (!address) {
      console.log("user didn't connect I guess");
      return;
    }
    setAddress(address);
    const balance = await fetchBalanceByDenom(address, "erc20/0x655ecB57432CC1370f65e5dc2309588b71b473A9");
    setBalance(formatEther(balance.balance.amount));
    console.log(await fetchAccount(address));
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} lg={12}>
          <Paper sx={paperSx}>
            <div>
              <Typography variant="h5" sx={{ mb: 2 }}>
                🤩 IBC Exxxtravaganza 🤩
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {address}
              </Typography>
              <Button variant="contained" color="primary" onClick={() => handleConnect()}>
                Connect Keplr
              </Button>
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <Paper sx={paperSx}>
            <div>
              <Typography variant="h5" sx={{ mb: 2 }}>
                💱 Convert from ERC20 to IBC 💱
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                ? ERC-20 NEOK
              </Typography>
              <Button variant="contained" color="primary" onClick={() => convertERC20(address)}>
                Convert 1 NEOK
              </Button>
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <Paper sx={paperSx}>
            <div>
              <Typography variant="h5" sx={{ mb: 2 }}>
                💰 IBC NEOK balance 💰
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {balance} NEOK
              </Typography>
              <Button variant="contained" color="primary" onClick={() => sendIBC(address)}>
                send IBC lol sure thing
              </Button>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

const paperSx = {
  p: 4,
  textAlign: "center",
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
