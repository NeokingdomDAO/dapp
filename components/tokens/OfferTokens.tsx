import { useContractsContext } from "contexts/ContractsContext";

import { useState } from "react";

import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, Slider, TextField, Typography } from "@mui/material";

import { BLOCKCHAIN_TRANSACTION_KEYS } from "@lib/constants";
import { calculateSteps } from "@lib/utils";

import useBlockchainTransactionStore from "@store/blockchainTransactionStore";

import Modal from "@components/Modal";

import useApproveToOffer from "@hooks/useApproveToOffer";
import useCheckAllowance from "@hooks/useCheckAllowance";
import useOfferTokens from "@hooks/useOfferTokens";
import useUserBalanceAndOffers from "@hooks/useUserBalanceAndOffers";

export default function OfferTokens() {
  const [modalOpen, setModalOpen] = useState(false);
  const [offered, setOffered] = useState(0);
  const { governanceTokenContract, internalMarketContractAddress } = useContractsContext();
  const { allowance, refreshAllowanceFromContract } = useCheckAllowance(
    governanceTokenContract,
    internalMarketContractAddress,
  );
  const { isAwaitingConfirmation, isLoading, type } = useBlockchainTransactionStore();

  const { data } = useUserBalanceAndOffers();
  const { onSubmit } = useOfferTokens();

  const { onSubmit: onSubmitApproveNeok } = useApproveToOffer();

  const handlePlaceOffer = async () => {
    const submitted = await onSubmit({ amount: offered });
    if (submitted) {
      setModalOpen(false);
      setOffered(0);
    }
  };

  const handleApproval = async () => {
    const submitted = await onSubmitApproveNeok();
    if (submitted) {
      await refreshAllowanceFromContract();
    }
  };

  const lockedTokens = data?.balance.lockedTokens || 0;
  const maxToOffer = allowance > lockedTokens ? lockedTokens : allowance;
  const isLoadingAllowance =
    (isAwaitingConfirmation || isLoading) && type === BLOCKCHAIN_TRANSACTION_KEYS.APPROVE_TO_OFFER;

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setModalOpen(true)} disabled={lockedTokens === 0}>
        Offer tokens
      </Button>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} size="medium">
        <>
          <Typography variant="h5">Token offer</Typography>
          <Alert
            severity="warning"
            action={
              <LoadingButton variant="contained" onClick={handleApproval} loading={isLoadingAllowance}>
                {allowance === 0 ? "Add allowance" : "Edit allowance"}
              </LoadingButton>
            }
            sx={{ mt: 2 }}
          >
            {allowance === 0 && "Before offering, you need to add allowance for your tokens"}
            {allowance > 0 && allowance < lockedTokens && `You can offer max ${maxToOffer} tokens`}
            {allowance > 0 && allowance >= lockedTokens && `You can offer up to your tokens balance`}
          </Alert>
          {allowance > 0 && (
            <>
              <Box sx={{ p: 4 }}>
                <Slider
                  size="small"
                  value={offered}
                  max={maxToOffer}
                  aria-label="Small"
                  valueLabelDisplay="auto"
                  step={calculateSteps(maxToOffer)}
                  marks={[
                    {
                      value: maxToOffer,
                      label: "Max Tokens",
                    },
                  ]}
                  onChange={(_, value) => setOffered(value as number)}
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
                  value={offered}
                  onChange={(e) => {
                    const inputValue = Number(e.target.value) < 0 ? 0 : Number(e.target.value);
                    setOffered(inputValue > maxToOffer ? maxToOffer : inputValue);
                  }}
                />
              </Box>
              <Box sx={{ textAlign: "center", pt: 4 }}>
                <LoadingButton
                  fullWidth
                  loading={(isAwaitingConfirmation || isLoading) && type === BLOCKCHAIN_TRANSACTION_KEYS.OFFER_TOKENS}
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  disabled={offered === 0}
                  onClick={handlePlaceOffer}
                >
                  Place offer
                </LoadingButton>
              </Box>
            </>
          )}
        </>
      </Modal>
    </>
  );
}
