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
import { CHAIN_TO_NAME, CosmosChains, OTHER_CHAIN } from "@hooks/ibc/utils";

export default function IBCBalance({ chain }: { chain: CosmosChains }) {
  const { connect, networks, isConnecting } = useKeplrContext();

  const address = networks?.[chain].address;
  const ethAddress = networks?.[chain].ethAddress;
  const otherChain = OTHER_CHAIN[chain];
  const otherAddress = networks?.[otherChain].address;

  // use isLoadingBalance just the first time the page loads
  const { balance, balanceFloat, error: balanceError, isLoading: isLoadingBalance } = useIBCBalance({ address });
  const [modalOpen, setModalOpen] = useState(false);
  const { send, isLoading } = useIBCSend(); // todo gian check this hook
  const [toSend, setToSend] = useState(0);

  const [newAddress, setNewAddress] = useState("");

  const handleModalClose = () => {
    setModalOpen(false);
    setNewAddress(otherAddress || "");
    setToSend(0);
  };

  const handleSendTokens = async () => {
    // here show user the fact that the modal closes as soon as the balance is updated (check if the new reloaded balance is different thanthe old one)
    const success = await send(address!, newAddress!, parseEther(toSend.toString()).toString());
    if (success) {
      handleModalClose();
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

        <Button variant="contained" color="primary" disabled={!balance} onClick={() => setModalOpen(true)}>
          Send to {CHAIN_TO_NAME[otherChain]}
        </Button>

        <Modal open={modalOpen} onClose={handleModalClose}>
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
        </Modal>
      </>
    </div>
  );
}
