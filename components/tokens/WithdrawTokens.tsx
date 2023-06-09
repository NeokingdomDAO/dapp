import { useAccount } from "wagmi";

import { useState } from "react";

import { LoadingButton } from "@mui/lab";
import { Box, Button, Slider, TextField, Typography } from "@mui/material";

import { calculateSteps } from "@lib/utils";

import useBlockchainTransactionStore from "@store/blockchainTransactionStore";

import ChangeableAddress from "@components/ChangeableAddress";
import Modal from "@components/Modal";

import useWithdrawTokens from "@hooks/useWithdrawTokens";

export default function WithdrawTokens({ withdrawableBalance }: { withdrawableBalance: number }) {
  const { address } = useAccount();
  const [modalOpen, setModalOpen] = useState(false);
  const [withdrawing, setWithdrawing] = useState(0);
  const [withdrawalAddress, setWithdrawalAddress] = useState(String(address));
  const { isAwaitingConfirmation, isLoading } = useBlockchainTransactionStore();

  const { onSubmit } = useWithdrawTokens();

  const handlePlaceOffer = async () => {
    const submitted = await onSubmit({ amount: withdrawing, toAddress: withdrawalAddress });
    if (submitted) {
      setModalOpen(false);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setWithdrawing(0);
    setWithdrawalAddress(String(address));
  };

  const maxToWithdraw = withdrawableBalance;

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setModalOpen(true)} disabled={maxToWithdraw === 0}>
        Withdraw tokens
      </Button>
      <Modal open={modalOpen} onClose={handleModalClose} size="medium">
        <>
          <Typography variant="h5">Withdraw tokens</Typography>
          <Box sx={{ p: 4 }}>
            <Slider
              size="small"
              value={withdrawing}
              max={maxToWithdraw}
              aria-label="Small"
              valueLabelDisplay="auto"
              step={calculateSteps(maxToWithdraw)}
              marks={[
                {
                  value: maxToWithdraw,
                  label: "Max Tokens",
                },
              ]}
              onChange={(_, value) => setWithdrawing(value as number)}
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
              value={withdrawing}
              onChange={(e) => {
                const inputValue = Number(e.target.value) < 0 ? 0 : Number(e.target.value);
                setWithdrawing(inputValue > maxToWithdraw ? maxToWithdraw : inputValue);
              }}
            />
          </Box>
          <ChangeableAddress
            initialAddress={address}
            newAddress={withdrawalAddress}
            setAddress={setWithdrawalAddress}
          />
          <Box sx={{ textAlign: "center", pt: 2 }}>
            <LoadingButton
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              disabled={withdrawing === 0 || withdrawalAddress.trim() === ""}
              onClick={handlePlaceOffer}
              loading={isAwaitingConfirmation || isLoading}
            >
              Withdraw
            </LoadingButton>
          </Box>
        </>
      </Modal>
    </>
  );
}
