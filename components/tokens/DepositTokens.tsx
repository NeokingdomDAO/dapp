import { useContractsContext } from "contexts/ContractsContext";

import { useState } from "react";

import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, CircularProgress, Slider, TextField, Typography } from "@mui/material";

import { BLOCKCHAIN_TRANSACTION_KEYS } from "@lib/constants";
import { calculateSteps } from "@lib/utils";

import useBlockchainTransactionStore from "@store/blockchainTransactionStore";

import Modal from "@components/Modal";

import useApproveToDeposit from "@hooks/useApproveToDeposit";
import useCheckAllowance from "@hooks/useCheckAllowance";
import useDeposit from "@hooks/useDepositNeok";
import useUserBalanceAndOffers from "@hooks/useUserBalanceAndOffers";

export default function DepositTokens() {
  const { neokingdomTokenContract, governanceTokenContractAddress } = useContractsContext();
  const { allowance, refreshAllowanceFromContract } = useCheckAllowance(
    neokingdomTokenContract,
    governanceTokenContractAddress,
  );
  const { onSubmit: onSubmitApproveNeok } = useApproveToDeposit();
  const { onSubmit } = useDeposit();
  const { isAwaitingConfirmation, isLoading, type } = useBlockchainTransactionStore();

  const { data, isLoading: isLoadingBalance } = useUserBalanceAndOffers();

  if (isLoadingBalance) {
    return <CircularProgress />;
  }

  const neokTokens = data?.balance.neokTokens || 0;

  const handleDepositTokens = async () => {
    await onSubmit({ amount: neokTokens });
  };

  const handleNeokAllowance = async () => {
    const submitted = await onSubmitApproveNeok();
    if (submitted) {
      await refreshAllowanceFromContract();
    }
  };

  const maxToOffer = allowance > neokTokens ? neokTokens : allowance;

  return (
    <Modal open size="medium" hasCloseButton={false}>
      <>
        <Alert severity="info" sx={{ mb: 2 }}>
          You have an active NEOK balance of {neokTokens} tokens. As for legal reasons you can&apos;t keep them in your
          whitelisted wallet, you can deposit them and you will be able to transfer them to your internal governance
          tokens after one week. This action is mandatory if you want to keep using the Dapp.
        </Alert>
        <Typography variant="h5">Deposit tokens</Typography>
        <Alert
          severity="warning"
          action={
            <LoadingButton
              variant="outlined"
              onClick={handleNeokAllowance}
              loading={
                (isAwaitingConfirmation || isLoading) && type === BLOCKCHAIN_TRANSACTION_KEYS.APPROVE_DEPOSIT_NEOK
              }
            >
              {allowance === 0 ? `Approve NEOK` : `Edit NEOK allowance`}
            </LoadingButton>
          }
          sx={{ mt: 2 }}
        >
          {allowance === 0 && "Before depositing, you need to add allowance for your NEOK"}
          {allowance > 0 && allowance < neokTokens && `You can deposit max ${maxToOffer} NEOK`}
          {allowance > 0 && allowance >= neokTokens && `You can deposit up to your NEOK balance`}
        </Alert>
        {allowance > 0 && (
          <>
            <Box sx={{ textAlign: "center", pt: 4 }}>
              <LoadingButton
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                disabled={neokTokens === 0}
                onClick={handleDepositTokens}
                loading={(isAwaitingConfirmation || isLoading) && type === BLOCKCHAIN_TRANSACTION_KEYS.DEPOSIT_NEOK}
              >
                Deposit {neokTokens} tokens
              </LoadingButton>
            </Box>
          </>
        )}
      </>
    </Modal>
  );
}
