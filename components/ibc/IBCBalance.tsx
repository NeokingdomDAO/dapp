import { formatEther, parseEther } from "ethers/lib/utils";

import { useState } from "react";

import LaunchIcon from "@mui/icons-material/Launch";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, IconButton, Slider, TextField, Typography } from "@mui/material";

import Modal from "@components/Modal";

import useIBCAccount from "@hooks/ibc/useIBCAccount";
import useIBCBalance from "@hooks/ibc/useIBCBalance";
import useIBCSend from "@hooks/ibc/useIBCSend";
import { CHAIN_TO_NAME, CosmosChains } from "@hooks/ibc/utils";

export default function IBCBalance({ chain }: { chain: CosmosChains }) {
  const otherChain = chain === "evmos" ? "crescent" : "evmos";
  const { address, ethAddress, error: addressError } = useIBCAccount(chain);
  const { address: otherAddress, error: otherAddressError } = useIBCAccount(otherChain);
  const { balance, balanceFloat, error: balanceError } = useIBCBalance({ address });
  const [modalOpen, setModalOpen] = useState(false);
  const { send, isLoading, error } = useIBCSend();
  const [toSend, setToSend] = useState(0);

  const handleSendTokens = async () => {
    await send(address!, otherAddress!, parseEther(toSend.toString()).toString());
    setModalOpen(false);
  };

  return (
    <div>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {CHAIN_TO_NAME[chain]} account
      </Typography>
      {addressError ? (
        <Alert severity="error">{addressError}</Alert>
      ) : balanceError ? (
        <Alert severity="error">{balanceError}</Alert>
      ) : balance && balanceFloat !== undefined ? (
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

          <Modal
            open={modalOpen}
            onClose={() => {
              setModalOpen(false);
            }}
          >
            <Box>
              <Typography variant="h5">IBC transfer to Crescent</Typography>
              <Box sx={{ p: 4 }}>
                <Slider
                  size="small"
                  value={toSend}
                  max={balanceFloat}
                  aria-label="Small"
                  valueLabelDisplay="auto"
                  step={1}
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

              <Typography variant="body1">
                Receiver: <strong>{otherAddress}</strong>
              </Typography>
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
      ) : null}
    </div>
  );
}
