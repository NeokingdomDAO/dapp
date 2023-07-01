import { useKeplrContext } from "contexts/KeplrContext";
import { formatEther, parseEther } from "ethers/lib/utils";
import Image from "next/image";
import { shallow } from "zustand/shallow";

import { useEffect, useRef, useState } from "react";

import { Send } from "@mui/icons-material";
import LaunchIcon from "@mui/icons-material/Launch";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  Slider,
  TextField,
  Typography,
} from "@mui/material";

import { calculateSteps } from "@lib/utils";

import useIbcStore from "@store/ibcStore";

import ChangeableAddress from "@components/ChangeableAddress";
import Modal from "@components/Modal";

import useCosmosAccount from "@hooks/ibc/useCosmosAccount";
import useIBCBalance from "@hooks/ibc/useIBCBalance";
import useIBCSend from "@hooks/ibc/useIBCSend";

import EvmosLogo from "../../images/evmos.png";

export default function IBCBalanceEvmos() {
  const { connect, networks, isConnecting } = useKeplrContext();
  const {
    isLoadingBalanceAfterSend,
    stopEvmosInterval,
    setEvmosBalance,
    setPrevEvmosBalance,
    setIsLoadingBalanceAfterSend,
    resetStore,
  } = useIbcStore(
    (state) => ({
      isLoadingBalanceAfterSend: state.isLoadingBalanceAfterSend,
      stopEvmosInterval: state.stopEvmosInterval,
      setEvmosBalance: state.setEvmosBalance,
      setPrevEvmosBalance: state.setPrevEvmosBalance,
      setIsLoadingBalanceAfterSend: state.setIsLoadingBalanceAfterSend,
      resetStore: state.resetStore,
    }),
    shallow,
  );

  const chain = "evmos";
  const evmosAddress = networks?.evmos.address;
  const ethAddress = networks?.evmos.ethAddress;
  const crescentAddress = networks?.crescent.address;

  const { account: cosmosAccount, isLoading: isLoadingCosmosAccount } = useCosmosAccount(evmosAddress as string);
  const { balance, balanceFloat, error: balanceError, reload } = useIBCBalance({ address: evmosAddress });
  const { sendTokens, isLoading } = useIBCSend(evmosAddress as string);

  const [modalOpen, setModalOpen] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [showAddress, setShowAddress] = useState(false);

  const [targetAddress, setTargetAddress] = useState<string | undefined>();
  const [tokenToSend, setTokenToSend] = useState(0);

  const handleModalClose = () => {
    setModalOpen(false);
    setTargetAddress(crescentAddress);
    setTokenToSend(0);
  };

  useEffect(() => {
    setTargetAddress(crescentAddress);
  }, [crescentAddress]);

  useEffect(() => {
    if (balanceFloat !== undefined) {
      setIsLoadingBalance(false);
      setEvmosBalance(balanceFloat);
    }
  }, [balanceFloat]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>();
  useEffect(() => {
    if (isLoadingBalanceAfterSend && !intervalRef.current && !stopEvmosInterval) {
      intervalRef.current = setInterval(() => reload(evmosAddress), 1000);
    }
    if (stopEvmosInterval) {
      intervalRef.current && clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, [isLoadingBalanceAfterSend, stopEvmosInterval]);

  const handleSendTokens = async () => {
    setPrevEvmosBalance(balanceFloat || 0);
    const amount = parseEther(tokenToSend.toString()).toString();
    const success = await sendTokens(targetAddress!, amount, cosmosAccount);
    if (success) {
      setIsLoadingBalanceAfterSend(true);
      handleModalClose();
    }
  };

  if (isConnecting || isLoadingBalance || isLoadingCosmosAccount) {
    return <CircularProgress />;
  }

  if (!evmosAddress) {
    return (
      <Alert
        severity="warning"
        action={
          <Button size="small" variant="outlined" onClick={() => typeof connect === "function" && connect(chain)}>
            Connect
          </Button>
        }
      >
        Please connect your Keplr wallet to the {chain} network
      </Alert>
    );
  }

  if (networks?.[chain].error) {
    return (
      <Alert severity="warning">
        It looks {chain} couldn&apos;t connect to Keplr. Please try again later, reloading the page. If the problem
        persists, please contact the engineers.
      </Alert>
    );
  }

  if (balanceError || typeof balanceFloat === "undefined") {
    return <Alert severity="warning">{balanceError || "It looks there is a problem calculating the balance"}</Alert>;
  }

  const renderToSendForm = () => {
    return (
      <Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Image src={EvmosLogo} alt="Evmos" height={40} />
          <Typography sx={{ ml: 2 }} variant="h5">
            Send NEOK to Crescent
          </Typography>
        </Box>
        <Box sx={{ p: 4 }}>
          <Slider
            size="small"
            value={tokenToSend}
            max={balanceFloat}
            aria-label="Small"
            valueLabelDisplay="auto"
            step={calculateSteps(balanceFloat)}
            marks={[
              {
                value: balanceFloat,
                label: "Max Tokens",
              },
            ]}
            onChange={(_, value) => setTokenToSend(value as number)}
          />
        </Box>
        <Box sx={{ textAlign: "center" }} mb={5}>
          <TextField
            id="tokens-number"
            label="Tokens"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            value={tokenToSend}
            onChange={(e) => {
              const inputValue = Number(e.target.value) < 0 ? 0 : Number(e.target.value);
              setTokenToSend(Math.min(inputValue, balanceFloat));
            }}
          />
        </Box>

        <ChangeableAddress
          initialAddress={crescentAddress}
          address={targetAddress as string}
          setAddress={(value) => setTargetAddress(value)}
        />

        <Box sx={{ textAlign: "center", pt: 4 }}>
          <LoadingButton
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={tokenToSend === 0}
            onClick={handleSendTokens}
            loading={isLoading}
          >
            Send to Crescent
          </LoadingButton>
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Card sx={{ cursor: "pointer" }} onClick={() => setShowAddress(!showAddress)}>
        <CardHeader
          avatar={<Image src={EvmosLogo} alt="Evmos" height={40} />}
          action={
            <Button
              sx={{ mt: 1 }}
              variant="outlined"
              endIcon={<Send />}
              disabled={!balanceFloat || !cosmosAccount?.base_account.pub_key || isLoadingBalanceAfterSend}
              onClick={(event) => {
                event.stopPropagation();
                setModalOpen(true);
                resetStore();
              }}
            >
              Send
            </Button>
          }
          title={<Typography sx={{ color: "rgb(237, 78, 51)" }}>EVMOS</Typography>}
          subheader={
            <Box>
              Balance:
              {isLoadingBalanceAfterSend ? (
                <CircularProgress sx={{ ml: 1 }} size={14} />
              ) : (
                ` ${balance ? formatEther(balance) : "…"} NEOK`
              )}
            </Box>
          }
        />
        {showAddress && (
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Address: {evmosAddress}
              <IconButton
                aria-label="open in Mintscan"
                size="small"
                href={`https://www.mintscan.io/${chain}/account/${evmosAddress}`}
                target="_new"
              >
                <LaunchIcon fontSize="inherit" />
              </IconButton>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {ethAddress && (
                <>
                  EVM Address: {ethAddress}
                  <IconButton
                    aria-label="open in EVMOS block explorer"
                    size="small"
                    href={`https://escan.live/address/${ethAddress}`}
                    target="_new"
                  >
                    <LaunchIcon fontSize="inherit" />
                  </IconButton>
                </>
              )}
            </Typography>
          </CardContent>
        )}
      </Card>

      {!cosmosAccount?.base_account.pub_key && (
        <Alert sx={{ mt: 2 }} severity="warning">
          It seems that you don&apos;t have a Public Key associated to this account. <br />
          You should do at least one transaction before sending Evmos to Crescent.
        </Alert>
      )}

      <Modal open={modalOpen} onClose={handleModalClose}>
        {renderToSendForm()}
      </Modal>
    </>
  );
}
