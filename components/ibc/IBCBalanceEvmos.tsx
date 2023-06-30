import { AccountResponse } from "@evmos/provider";
import { useKeplrContext } from "contexts/KeplrContext";
import { formatEther, parseEther } from "ethers/lib/utils";

import { useEffect, useState } from "react";

import LaunchIcon from "@mui/icons-material/Launch";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, CircularProgress, IconButton, Slider, TextField, Typography } from "@mui/material";

import { calculateSteps } from "@lib/utils";

import ChangeableAddress from "@components/ChangeableAddress";
import Modal from "@components/Modal";

import useIBCBalance from "@hooks/ibc/useIBCBalance";
import useIBCSend from "@hooks/ibc/useIBCSend";
import { CHAIN_TO_NAME, OTHER_CHAIN } from "@hooks/ibc/utils";

export default function IBCBalanceEvmos({ cosmosAccount }: { cosmosAccount: AccountResponse["account"] | null }) {
  const { connect, networks, isConnecting } = useKeplrContext();
  const chain = "evmos";

  const address = networks?.[chain].address;
  const ethAddress = networks?.[chain].ethAddress;

  const otherChain = OTHER_CHAIN[chain];
  const otherAddress = networks?.[otherChain].address;

  const { balance, balanceFloat, error: balanceError, reload } = useIBCBalance({ address });
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [isLoadingBalanceAfterSend, setIsLoadingBalanceAfterSend] = useState(false);
  const { send, isLoading } = useIBCSend(address as string);
  const [toSend, setToSend] = useState(0);
  const [currentBalance, setCurrentBalance] = useState<number | undefined>();

  const [newAddress, setNewAddress] = useState("");

  const handleModalClose = (event?: {}, reason?: string) => {
    console.log("🐞 > handleModalClose:", isLoadingBalanceAfterSend, reason);
    if (!isLoadingBalanceAfterSend || (isLoadingBalanceAfterSend && reason === "forceClose")) {
      setModalOpen(false);
      // setIsLoadingBalanceAfterSend(false);
      setNewAddress(otherAddress || "");
      setToSend(0);
    }
  };

  let checkBalanceInterval: ReturnType<typeof setInterval> | undefined;

  useEffect(() => {
    console.log(
      "🐞 > useEffect:",
      balance,
      balanceFloat,
      isLoadingBalanceAfterSend,
      currentBalance,
      checkBalanceInterval,
    );
    if (balance) setIsLoadingBalance(false);
    if (isLoadingBalanceAfterSend && currentBalance !== balanceFloat) {
      console.log("🐞 > checkBalanceInterval:", checkBalanceInterval);
      checkBalanceInterval && clearInterval(checkBalanceInterval);
      handleModalClose({}, "forceClose");
    }
  }, [balanceFloat, isLoadingBalanceAfterSend, currentBalance, checkBalanceInterval]);

  const handleSendTokens = async () => {
    setCurrentBalance(balanceFloat);
    const success = await send(newAddress!, parseEther(toSend.toString()).toString());
    console.log("🐞 > success:", success);
    if (success) {
      setIsLoadingBalanceAfterSend(true);
      checkBalanceInterval = setInterval(() => reload(address), 1000);
      console.log("🐞 > checkBalanceInterval:", checkBalanceInterval);
    }
  };

  useEffect(() => {
    setNewAddress(otherAddress || "");
  }, [otherAddress]);

  if (isConnecting || isLoadingBalance) {
    return <CircularProgress />;
  }

  if (!networks?.[chain].address) {
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
        <Typography variant="h5">Send to {CHAIN_TO_NAME[otherChain]}</Typography>
        <Box sx={{ p: 4 }}>
          <Slider
            size="small"
            value={toSend}
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
            onChange={(_, value) => setToSend(value as number)}
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
            value={toSend}
            onChange={(e) => {
              const inputValue = Number(e.target.value) < 0 ? 0 : Number(e.target.value);
              setToSend(Math.min(inputValue, balanceFloat));
            }}
          />
        </Box>

        <ChangeableAddress
          initialAddress={otherAddress}
          newAddress={newAddress as string}
          setAddress={(a) => setNewAddress(a)}
        />

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
      </Box>
    );
  };

  const renderLoadingBalance = () => {
    return (
      <Box>
        <Typography variant="h5">Send to {CHAIN_TO_NAME[otherChain]}</Typography>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography variant="h6">Waiting for transaction to complete...</Typography>
          <CircularProgress sx={{ mt: 2 }} />
        </Box>
      </Box>
    );
  };

  return (
    <div>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {CHAIN_TO_NAME[chain]} account
      </Typography>
      <>
        <p>
          Address: {address}
          <IconButton
            aria-label="open in Mintscan"
            size="small"
            href={`https://www.mintscan.io/${chain}/account/${address}`}
            target="_new"
          >
            <LaunchIcon fontSize="inherit" />
          </IconButton>
          <br />
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
          <br />
          Balance: {balance ? formatEther(balance) : "…"} NEOK
        </p>

        <Button
          variant="contained"
          color="primary"
          disabled={!balance || !cosmosAccount?.base_account.pub_key}
          onClick={() => setModalOpen(true)}
        >
          Send to {CHAIN_TO_NAME[otherChain]}
        </Button>

        {!cosmosAccount?.base_account.pub_key && (
          <Alert sx={{ mt: 2 }} severity="warning">
            It looks like you don&apos;t have a Public Key for this account. <br /> It means that you must perform at
            least one transaction before sending Evmos to Crescent.
          </Alert>
        )}

        <Modal open={modalOpen} onClose={isLoadingBalanceAfterSend ? () => true : handleModalClose}>
          {isLoadingBalanceAfterSend ? renderLoadingBalance() : renderToSendForm()}
        </Modal>
      </>
    </div>
  );
}
