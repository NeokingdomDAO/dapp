import { evmosToEth } from "@evmos/address-converter";
import { createTxRaw } from "@evmos/proto";
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
  Sender,
  TxContext,
  TxPayload,
  createTxIBCMsgTransfer,
  createTxMsgConvertERC20,
} from "@evmos/transactions";
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { Long } from "cosmjs-types/helpers";
import { formatEther, parseEther } from "ethers/lib/utils.js";

import { useEffect, useState } from "react";

import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, Grid, Paper, Slider, TextField, Typography } from "@mui/material";

import Modal from "@components/Modal";

import { useContracts } from "@hooks/useContracts";
import useUserBalanceAndOffers from "@hooks/useUserBalanceAndOffers";

const chainCrescent: Chain = {
  cosmosChainId: "crescent-1",
};

const chainEvmos: Chain = {
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

const nodeUrlEvmos = "https://rest.cosmos.directory/evmos";
const nodeUrlCrescent = "https://rest.cosmos.directory/crescent";

const restOptions = {
  method: "GET",
  headers: { "Content-Type": "application/json" },
};

const fetchLastBlockCrescent = async () => {
  const rawResult = await fetch("https://rest.cosmos.directory/crescent/blocks/latest");
  const result = await rawResult.json();
  return parseInt(result.block.header.height);
};

const fetchBalanceByDenom = async (address: string, denom: string, nodeUrl: string) => {
  const queryEndpoint = `${nodeUrl}${generateEndpointBalanceByDenom(address, denom)}`;
  const rawResult = await fetch(queryEndpoint, restOptions);

  const result = (await rawResult.json()) as BalanceByDenomResponse;

  return result;
};

const fetchERC20ContractAddress = async (nodeUrl: string) => {
  const queryEndpoint = `${nodeUrl}/evmos/erc20/v1/token_pairs`;
  const rawResult = await fetch(queryEndpoint, restOptions);

  const result = (await rawResult.json()) as TokenPairResponse;

  return result;
};

const fetchAddress = async (chain: "evmos" | "crescent" = "evmos") => {
  const cosmosChainID = chain === "evmos" ? "evmos_9001-2" : "crescent-1";
  const account = await window?.keplr?.getKey(cosmosChainID);
  if (account) {
    return account.bech32Address;
  }
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

const convertERC20 = async (senderAddress: string, amount: string) => {
  console.log("Converting", amount);

  const senderHexAddress = evmosToEth(senderAddress);
  const account = await fetchAccount(senderAddress, nodeUrlEvmos);

  const sender: Sender = {
    accountAddress: senderAddress,
    sequence: parseInt(account.account.base_account.sequence),
    accountNumber: parseInt(account.account.base_account.account_number),
    pubkey: account.account.base_account.pub_key!.key,
  };

  const fee: Fee = {
    amount: "10000000",
    denom: "aevmos",
    gas: "2000000",
  };

  const memo = "";

  const context: TxContext = {
    chain: chainEvmos,
    sender,
    fee,
    memo,
  };

  const params: MsgConvertERC20Params = {
    contractAddress: "0x655ecB57432CC1370f65e5dc2309588b71b473A9",
    amount,
    receiverBech32: senderAddress,
    senderHex: senderHexAddress,
  };

  const tx: TxPayload = createTxMsgConvertERC20(context, params);
  const { signDirect } = tx;

  const signResponse = await window?.keplr?.signDirect(chainEvmos.cosmosChainId, sender.accountAddress, {
    bodyBytes: signDirect.body.toBinary(),
    authInfoBytes: signDirect.authInfo.toBinary(),
    chainId: chainEvmos.cosmosChainId,
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

  const broadcastEndpoint = `${nodeUrlEvmos}${generateEndpointBroadcast()}`;
  const broadcastPost = await fetch(broadcastEndpoint, postOptions);

  const response = await broadcastPost.json();
  console.log("broadcasted", response);
};

const sendIBC = async (senderAddress: string, receiverAddress: string, amount: string, nodeUrl: string) => {
  console.log("Sending ", amount);
  const account = await fetchAccount(senderAddress, nodeUrl);
  console.log(account, Object.keys(account));
  let sender: Sender;
  if (nodeUrl === nodeUrlCrescent) {
    sender = {
      accountAddress: senderAddress,
      sequence: parseInt(account.account.sequence),
      accountNumber: parseInt(account.account.account_number),
      pubkey: account.account.pub_key.key,
    };
  } else {
    sender = {
      accountAddress: senderAddress,
      sequence: parseInt(account.account.base_account.sequence),
      accountNumber: parseInt(account.account.base_account.account_number),
      pubkey: account.account.base_account.pub_key!.key,
    };
  }

  const fee: Fee = {
    amount: "10000000",
    denom: "aevmos",
    gas: "200000",
  };

  const memo = "";

  const chain = nodeUrl === "crescent" ? chainCrescent : chainEvmos;

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

  const broadcastEndpoint = `${nodeUrlEvmos}${generateEndpointBroadcast()}`;
  const broadcastPost = await fetch(broadcastEndpoint, postOptions);

  const response = await broadcastPost.json();
  console.log("broadcasted", response);
};

export default function IBC() {
  const [addressEvmos, setAddressEvmos] = useState<string | undefined>();
  const [addressCrescent, setAddressCresent] = useState<string | undefined>();
  const [balanceERC, setBalanceERC] = useState(0);
  const [balanceIBC, setBalanceIBC] = useState(0);
  const [balanceIBC2, setBalanceIBC2] = useState(0);
  const [balanceIBC3, setBalanceIBC3] = useState(0);
  const [modalConvertOpen, setModalConvertOpen] = useState(false);
  const [modalSendOpen, setModalSendOpen] = useState(false);
  const [modalSendEvmosOpen, setModalSendEvmosOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toConvert, setToConvert] = useState(0);
  const [toSend, setToSend] = useState(0);
  const [toSendEvmos, setToSendEvmos] = useState(0);
  const { neokingdomTokenContract } = useContracts();

  useEffect(() => {
    const interval = setInterval(() => {
      if (addressEvmos && addressCrescent) {
        handleConnect();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleModalClose = () => {
    setModalConvertOpen(false);
    setModalSendOpen(false);
    setModalSendEvmosOpen(false);
  };

  const handleConnect = async () => {
    const evmosAddress = await fetchAddress("evmos");
    if (!evmosAddress) {
      console.log("user didn't connect I guess");
      return;
    }
    setAddressEvmos(evmosAddress);

    const crescentAddress = await fetchAddress("crescent");
    if (!crescentAddress) {
      console.log("user didn't connect I guess");
      return;
    }
    setAddressCresent(crescentAddress);

    const balanceERC = await neokingdomTokenContract!.balanceOf(evmosToEth(evmosAddress));
    setBalanceERC(parseFloat(formatEther(balanceERC)));

    const balanceIBC = await fetchBalanceByDenom(
      evmosAddress,
      "erc20/0x655ecB57432CC1370f65e5dc2309588b71b473A9",
      nodeUrlEvmos,
    );
    setBalanceIBC(parseFloat(formatEther(balanceIBC.balance.amount)));

    const balanceIBC2 = await fetchBalanceByDenom(
      crescentAddress,
      "ibc/4DD3698C2FCEA87CDE843D3EA6228F2589A4DF6655A7C16D766010D9CA2E69FB",
      nodeUrlCrescent,
    );
    setBalanceIBC2(parseFloat(formatEther(balanceIBC2.balance.amount)));

    const balanceIBC3 = await fetchBalanceByDenom(
      evmosAddress,
      "ibc/4DD3698C2FCEA87CDE843D3EA6228F2589A4DF6655A7C16D766010D9CA2E69FB",
      nodeUrlEvmos,
    );
    setBalanceIBC3(parseFloat(formatEther(balanceIBC3.balance.amount)));
  };

  const handleConvertTokens = async () => {
    setIsLoading(true);
    await convertERC20(addressEvmos!, parseEther(toConvert.toString()).toString());
    setIsLoading(false);
    handleModalClose();
  };

  const handleSendTokens = async () => {
    setIsLoading(true);
    await sendIBC(addressEvmos!, addressCrescent!, parseEther(toSend.toString()).toString(), nodeUrlEvmos);
    setIsLoading(false);
    handleModalClose();
  };

  const handleSendTokensEvmos = async () => {
    setIsLoading(true);
    await sendIBC(addressCrescent!, addressEvmos!, parseEther(toSendEvmos.toString()).toString(), nodeUrlCrescent);
    setIsLoading(false);
    handleModalClose();
  };

  return (
    <>
      <Alert variant="filled" severity="warning" sx={{ mb: 2 }}>
        HERE BE DRAGONS: these features are not stable yet, use with caution.
      </Alert>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} lg={12}>
          <Paper sx={paperSx}>
            <div>
              <Typography variant="h5" sx={{ mb: 2 }}>
                🤩 IBC Extravaganza 🤩
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {addressEvmos}
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {addressCrescent}
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
                💱 Convert from ERC-20 to IBC 💱
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {balanceERC} NEOK
              </Typography>
              <Button
                variant="contained"
                color="primary"
                disabled={balanceERC === 0}
                onClick={() => setModalConvertOpen(true)}
              >
                Convert to IBC
              </Button>

              <Modal open={modalConvertOpen} onClose={handleModalClose} size="medium">
                <>
                  <Typography variant="h5">Convert tokens</Typography>
                  <Box sx={{ p: 4 }}>
                    <Slider
                      size="small"
                      value={toConvert}
                      max={balanceERC}
                      aria-label="Small"
                      valueLabelDisplay="auto"
                      step={1}
                      marks={[
                        {
                          value: balanceERC,
                          label: "Max Tokens",
                        },
                      ]}
                      onChange={(_, value) => setToConvert(value as number)}
                    />
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <TextField
                      id="tokens-number"
                      label="Tokens"
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={toConvert}
                      onChange={(e) => {
                        const inputValue = Number(e.target.value) < 0 ? 0 : Number(e.target.value);
                        setToConvert(Math.min(inputValue, balanceERC));
                      }}
                    />
                  </Box>
                  <Box sx={{ textAlign: "center", pt: 4 }}>
                    <LoadingButton
                      fullWidth
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      disabled={toConvert === 0}
                      onClick={handleConvertTokens}
                      loading={isLoading}
                    >
                      Convert tokens
                    </LoadingButton>
                  </Box>
                </>
              </Modal>
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
                {balanceIBC} NEOK
              </Typography>
              <Button
                variant="contained"
                color="primary"
                disabled={balanceIBC === 0}
                onClick={() => setModalSendOpen(true)}
              >
                Send to Crescent
              </Button>

              <Modal open={modalSendOpen} onClose={handleModalClose} size="medium">
                <>
                  <Typography variant="h5">IBC transfer to Crescent</Typography>
                  <Box sx={{ p: 4 }}>
                    <Slider
                      size="small"
                      value={toSend}
                      max={balanceIBC}
                      aria-label="Small"
                      valueLabelDisplay="auto"
                      step={1}
                      marks={[
                        {
                          value: balanceIBC,
                          label: "Max Tokens",
                        },
                      ]}
                      onChange={(_, value) => setToSend(value as number)}
                    />
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <TextField
                      id="tokens-number"
                      label="Tokens"
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={toSend}
                      onChange={(e) => {
                        const inputValue = Number(e.target.value) < 0 ? 0 : Number(e.target.value);
                        setToSend(Math.min(inputValue, balanceIBC));
                      }}
                    />
                  </Box>
                  <Box sx={{ textAlign: "center", pt: 4 }}>
                    <LoadingButton
                      fullWidth
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      disabled={toSend === 0}
                      onClick={handleSendTokens}
                      loading={isLoading}
                    >
                      Send
                    </LoadingButton>
                  </Box>
                </>
              </Modal>
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <Paper sx={paperSx}>
            <div>
              <Typography variant="h5" sx={{ mb: 2 }}>
                💰 IBC NEOK balance2 💰
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {balanceIBC2} NEOK
              </Typography>
              <Button
                variant="contained"
                color="primary"
                disabled={balanceIBC2 === 0}
                onClick={() => setModalSendEvmosOpen(true)}
              >
                Send to EVMOS
              </Button>

              <Modal open={modalSendEvmosOpen} onClose={handleModalClose} size="medium">
                <>
                  <Typography variant="h5">IBC transfer to EVMOS</Typography>
                  <Box sx={{ p: 4 }}>
                    <Slider
                      size="small"
                      value={toSendEvmos}
                      max={balanceIBC2}
                      aria-label="Small"
                      valueLabelDisplay="auto"
                      step={1}
                      marks={[
                        {
                          value: balanceIBC2,
                          label: "Max Tokens",
                        },
                      ]}
                      onChange={(_, value) => setToSendEvmos(value as number)}
                    />
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <TextField
                      id="tokens-number"
                      label="Tokens"
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={toSendEvmos}
                      onChange={(e) => {
                        const inputValue = Number(e.target.value) < 0 ? 0 : Number(e.target.value);
                        setToSend(Math.min(inputValue, balanceIBC2));
                      }}
                    />
                  </Box>
                  <Box sx={{ textAlign: "center", pt: 4 }}>
                    <LoadingButton
                      fullWidth
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      disabled={toSendEvmos === 0}
                      onClick={handleSendTokensEvmos}
                      loading={isLoading}
                    >
                      Send
                    </LoadingButton>
                  </Box>
                </>
              </Modal>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Paper sx={paperSx}>
            <div>
              <Typography variant="h5" sx={{ mb: 2 }}>
                💰 IBC NEOK balance3 💰
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {balanceIBC3} NEOK
              </Typography>
              <Button
                variant="contained"
                color="primary"
                disabled={balanceIBC3 === 0}
                onClick={() => setModalSendEvmosOpen(true)}
              >
                Send to EVMOS
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
