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

import useIBCBalance from "@hooks/ibc/useIBCBalance";
import useIBCSend from "@hooks/ibc/useIBCSend";

import CrescentLogo from "../../images/crescent.svg";

export default function IBCBalanceCrescent() {
  const { connect, networks, isConnecting } = useKeplrContext();
  const {
    stopCrescentInterval,
    isLoadingBalanceAfterSend,
    setCrescentBalance,
    setPrevCrescentBalance,
    setIsLoadingBalanceAfterSend,
    resetStore,
  } = useIbcStore(
    (state) => ({
      isLoadingBalanceAfterSend: state.isLoadingBalanceAfterSend,
      stopCrescentInterval: state.stopCrescentInterval,
      setCrescentBalance: state.setCrescentBalance,
      setPrevCrescentBalance: state.setPrevCrescentBalance,
      setIsLoadingBalanceAfterSend: state.setIsLoadingBalanceAfterSend,
      resetStore: state.resetStore,
    }),
    shallow,
  );

  const chain = "crescent";
  const evmosAddress = networks?.evmos.address;
  const crescentAddress = networks?.crescent.address;

  const { balance, balanceFloat, error: balanceError, reload } = useIBCBalance({ address: crescentAddress });
  const { sendTokens, isLoading } = useIBCSend(crescentAddress as string);

  const [modalOpen, setModalOpen] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [showAddress, setShowAddress] = useState(false);

  const [targetAddress, setTargetAddress] = useState<string | undefined>();
  const [tokenToSend, setTokenToSend] = useState(0);

  const handleModalClose = () => {
    setModalOpen(false);
    setTargetAddress(evmosAddress);
    setTokenToSend(0);
  };

  useEffect(() => {
    setTargetAddress(evmosAddress);
  }, [evmosAddress]);

  useEffect(() => {
    if (balanceFloat !== undefined) {
      setIsLoadingBalance(false);
      setCrescentBalance(balanceFloat);
    }
  }, [balanceFloat]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>();
  useEffect(() => {
    if (isLoadingBalanceAfterSend && !intervalRef.current && !stopCrescentInterval) {
      intervalRef.current = setInterval(() => reload(crescentAddress), 1000);
    }
    if (stopCrescentInterval) {
      intervalRef.current && clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, [isLoadingBalanceAfterSend, stopCrescentInterval]);

  const handleSendTokens = async () => {
    setPrevCrescentBalance(balanceFloat || 0);
    const amount = parseEther(tokenToSend.toString()).toString();
    const success = await sendTokens(targetAddress!, amount);
    if (success) {
      setIsLoadingBalanceAfterSend(true);
      handleModalClose();
    }
  };

  if (isConnecting || isLoadingBalance) {
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
          <Image src={CrescentLogo} alt="Evmos" height={40} />
          <Typography sx={{ ml: 2 }} variant="h5">
            Send NEOK to Evmos
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
          initialAddress={evmosAddress}
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
            Send to Evmos
          </LoadingButton>
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Card sx={{ cursor: "pointer" }} onClick={() => setShowAddress(!showAddress)}>
        <CardHeader
          avatar={<Image src={CrescentLogo} alt="Crescent" height={40} />}
          action={
            <Button
              sx={{ mt: 1 }}
              variant="outlined"
              endIcon={<Send />}
              disabled={!balanceFloat || isLoadingBalanceAfterSend}
              onClick={(event) => {
                event.stopPropagation();
                setModalOpen(true);
                resetStore();
              }}
            >
              Send
            </Button>
          }
          title={<Typography sx={{ color: "rgb(235, 175, 118)" }}>Crescent</Typography>}
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
              Address: {crescentAddress}
              <IconButton
                aria-label="open in Mintscan"
                size="small"
                href={`https://www.mintscan.io/${chain}/account/${crescentAddress}`}
                target="_new"
              >
                <LaunchIcon fontSize="inherit" />
              </IconButton>
            </Typography>
          </CardContent>
        )}
      </Card>
      <Modal open={modalOpen} onClose={handleModalClose}>
        {renderToSendForm()}
      </Modal>
    </>
  );
}
