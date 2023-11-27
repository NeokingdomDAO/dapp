import { useContractsContext } from "contexts/ContractsContext";
import { Offer } from "types";

import { useState } from "react";

import { LoadingButton } from "@mui/lab";
import { Alert, Box, Grid, Slider, TextField, Typography } from "@mui/material";

import { BLOCKCHAIN_TRANSACTION_KEYS } from "@lib/constants";
import { calculateSteps } from "@lib/utils";

import useBlockchainTransactionStore from "@store/blockchainTransactionStore";

import Modal from "@components/Modal";
import UsersAutocomplete from "@components/UsersAutocomplete";

import useApproveToMatchOffer from "@hooks/useApproveToMatchOffer";
import useCheckAllowance from "@hooks/useCheckAllowance";
import useMatchTokens from "@hooks/useMatchTokens";
import { bigIntToNum } from "@hooks/useUserBalanceAndOffers";

import OfferCard from "./OfferCard";

export default function OffersList({ offers, noOffersMessage }: { offers: Offer[]; noOffersMessage: string }) {
  const [matchingOfferOpen, setMatchingOfferOpen] = useState<Offer | null>(null);
  const [matchingTokens, setMatchingTokens] = useState(0);
  const [selectedUserAddress, setSelectedUserAddress] = useState<string | null>(null);

  const { usdcContract, internalMarketContractAddress } = useContractsContext();
  const { allowance, refreshAllowanceFromContract } = useCheckAllowance(usdcContract, internalMarketContractAddress);
  const { isLoading, isAwaitingConfirmation, type } = useBlockchainTransactionStore();
  const { onSubmit } = useMatchTokens();
  const { onSubmit: onSubmitApproveUsdc } = useApproveToMatchOffer();

  const handleOnMatch = (offer: Offer) => {
    setMatchingOfferOpen(offer);
  };

  const handleMatchOffer = async () => {
    const submitted = await onSubmit({ amount: matchingTokens, offerUserAddress: matchingOfferOpen?.from as string });
    if (submitted) {
      setMatchingOfferOpen(null);
      setMatchingTokens(0);
    }
  };

  const handleChangeAllowance = async () => {
    const submitted = await onSubmitApproveUsdc();
    if (submitted) {
      await refreshAllowanceFromContract();
    }
  };

  const handleModalClose = () => {
    setMatchingOfferOpen(null);
    setMatchingTokens(0);
  };

  const currentOfferAmount = bigIntToNum(matchingOfferOpen?.amount || BigInt(0));

  const allowanceLessThanOfferAmount = allowance < currentOfferAmount;

  const maxToOffer = allowance > currentOfferAmount ? currentOfferAmount : allowance;

  const usersAddresses = [...new Set(offers.map((offer) => offer.from))];

  return (
    <>
      <Modal open={!!matchingOfferOpen} onClose={handleModalClose} size="medium">
        <>
          <Typography variant="h5">Match offer</Typography>
          {matchingOfferOpen && (
            <Alert
              severity="warning"
              action={
                <LoadingButton
                  variant="contained"
                  size="small"
                  onClick={handleChangeAllowance}
                  loading={
                    (isLoading || isAwaitingConfirmation) && type === BLOCKCHAIN_TRANSACTION_KEYS.APPROVE_TO_MATCH_OFFER
                  }
                >
                  {allowance === 0 ? "Approve USDC" : "Edit allowance"}
                </LoadingButton>
              }
              sx={{ mt: 2 }}
            >
              {allowance === 0 && "You need to approve the contract to spend your USDC."}
              {allowance > 0 &&
                `Offer is ${currentOfferAmount}. ${
                  allowanceLessThanOfferAmount ? `You can match it up to ${allowance} USDC.` : `You can fully match it`
                }`}
            </Alert>
          )}
          {allowance > 0 && (
            <>
              <Box sx={{ p: 4 }}>
                <Slider
                  size="small"
                  value={matchingTokens}
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
                  onChange={(_, value) => setMatchingTokens(value as number)}
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
                  value={matchingTokens}
                  onChange={(e) => {
                    const inputValue = Number(e.target.value) < 0 ? 0 : Number(e.target.value);
                    setMatchingTokens(inputValue > maxToOffer ? maxToOffer : inputValue);
                  }}
                />
              </Box>
              <Box sx={{ textAlign: "center", pt: 4 }}>
                <LoadingButton
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  disabled={matchingTokens === 0}
                  onClick={handleMatchOffer}
                  loading={(isLoading || isAwaitingConfirmation) && type === BLOCKCHAIN_TRANSACTION_KEYS.MATCH_TOKENS}
                >
                  Match offer
                </LoadingButton>
              </Box>
            </>
          )}
        </>
      </Modal>
      {offers.length === 0 ? (
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          {noOffersMessage}
        </Typography>
      ) : (
        <>
          {usersAddresses.length > 1 && (
            <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
              <UsersAutocomplete
                filterList={usersAddresses}
                selectedAddress={selectedUserAddress}
                onChange={(address) => setSelectedUserAddress(address)}
                label="Filter by contributor"
              />
            </Box>
          )}
          <Grid container spacing={2}>
            {offers
              .filter((offer) => !selectedUserAddress || offer.from === selectedUserAddress)
              .map((offer) => (
                <Grid key={offer.id} item xs={12} md={6} lg={4}>
                  <OfferCard offer={offer} onMatchClicked={handleOnMatch} />
                </Grid>
              ))}
          </Grid>
        </>
      )}
    </>
  );
}
