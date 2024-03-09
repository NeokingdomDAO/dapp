import { useContractsContext } from "contexts/ContractsContext";
import { Offer } from "types";
import { useAccount } from "wagmi";

import { useState } from "react";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, Grid, Slider, TextField, Typography } from "@mui/material";

import { BLOCKCHAIN_TRANSACTION_KEYS } from "@lib/constants";
import { downloadOffersCsv } from "@lib/exportOffers";
import { calculateSteps } from "@lib/utils";

import useBlockchainTransactionStore from "@store/blockchainTransactionStore";

import Modal from "@components/Modal";
import UsersAutocomplete from "@components/UsersAutocomplete";

import useApproveToMatchOffer from "@hooks/useApproveToMatchOffer";
import useCheckAllowance from "@hooks/useCheckAllowance";
import useMatchTokens from "@hooks/useMatchTokens";
import useOdooUsers from "@hooks/useOdooUsers";
import { bigIntToNum } from "@hooks/useUserBalanceAndOffers";

import OfferCard from "./OfferCard";

export default function OffersList({
  offers,
  noOffersMessage,
  isExportEnabled,
}: {
  offers: Offer[];
  noOffersMessage: string;
  isExportEnabled?: boolean;
}) {
  const [matchingOfferOpen, setMatchingOfferOpen] = useState<Offer | null>(null);
  const [matchingTokens, setMatchingTokens] = useState(0);
  const [selectedUserAddress, setSelectedUserAddress] = useState<string | null>(null);

  const { usdcContract, internalMarketContractAddress } = useContractsContext();
  const { allowance, refreshAllowanceFromContract } = useCheckAllowance(usdcContract, internalMarketContractAddress);
  const { isLoading, isAwaitingConfirmation, type } = useBlockchainTransactionStore();
  const { onSubmit } = useMatchTokens();
  const { onSubmit: onSubmitApproveUsdc } = useApproveToMatchOffer();
  const { getOdooUser, isLoading: isLoadingUsers, error: errorUsers } = useOdooUsers();

  const { address: userAddress } = useAccount();
  const userAddressLowerCase = userAddress?.toLocaleLowerCase();

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

  const filteredOffers = offers.filter((offer) => !selectedUserAddress || offer.from === selectedUserAddress);

  const isCurrentUserSelected = selectedUserAddress?.toLocaleLowerCase() === userAddressLowerCase;
  const isOnlyUserInList =
    usersAddresses.length === 1 && usersAddresses[0].toLocaleLowerCase() === userAddressLowerCase;
  const showExportButton = isExportEnabled && (isCurrentUserSelected || isOnlyUserInList);
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
                  {/* We need <span> to prevent a bug with Chrome and translations: https://mui.com/material-ui/react-button/#loading-button */}
                  <span>Match offer</span>
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
          {(usersAddresses.length > 1 || showExportButton) && (
            <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
              {showExportButton && (
                <LoadingButton
                  endIcon={<FileDownloadIcon />}
                  loading={isLoadingUsers}
                  variant="outlined"
                  color="primary"
                  loadingPosition="end"
                  disabled={errorUsers}
                  onClick={() => {
                    downloadOffersCsv(filteredOffers, getOdooUser);
                  }}
                >
                  {/* We need <span> to prevent a bug with Chrome and translations: https://mui.com/material-ui/react-button/#loading-button */}
                  <span>Export</span>
                </LoadingButton>
              )}
              {usersAddresses.length > 1 && (
                <Box sx={{ ml: "auto" }}>
                  <UsersAutocomplete
                    filterList={usersAddresses}
                    selectedAddress={selectedUserAddress}
                    onChange={(address) => setSelectedUserAddress(address)}
                    label="Filter by contributor"
                  />
                </Box>
              )}
            </Box>
          )}
          <Grid container spacing={2}>
            {filteredOffers.map((offer) => (
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
