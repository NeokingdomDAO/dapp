import { useContractsContext } from "contexts/ContractsContext";

import { useState } from "react";

import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, Slider, TextField, Typography } from "@mui/material";

import { BLOCKCHAIN_TRANSACTION_KEYS } from "@lib/constants";
import { calculateSteps } from "@lib/utils";

import useBlockchainTransactionStore from "@store/blockchainTransactionStore";

import Modal from "@components/Modal";

import useApproveToDeposit from "@hooks/useApproveToDeposit";
import useCheckAllowance from "@hooks/useCheckAllowance";
import useDeposit from "@hooks/useDepositNeok";
import useUserBalanceAndOffers from "@hooks/useUserBalanceAndOffers";

export default function DepositTokens() {
  const [modalOpen, setModalOpen] = useState(false);
  const [depositing, setDepositing] = useState(0);
  const { neokingdomTokenContract, governanceTokenContractAddress } = useContractsContext();
  const { allowance, refreshAllowanceFromContract } = useCheckAllowance(
    neokingdomTokenContract,
    governanceTokenContractAddress,
  );
  const { onSubmit: onSubmitApproveNeok } = useApproveToDeposit();
  const { onSubmit } = useDeposit();
  const { isAwaitingConfirmation, isLoading, type } = useBlockchainTransactionStore();

  const { data } = useUserBalanceAndOffers();

  const handleDepositTokens = async () => {
    const submitted = await onSubmit({ amount: depositing });
    if (submitted) {
      setModalOpen(false);
      setDepositing(0);
    }
  };

  const handleNeokAllowance = async () => {
    const submitted = await onSubmitApproveNeok();
    if (submitted) {
      await refreshAllowanceFromContract();
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setDepositing(0);
  };

  const neokTokens = data?.balance.neokTokens || 0;
  const maxToOffer = allowance > neokTokens ? neokTokens : allowance;

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setModalOpen(true)} disabled={neokTokens === 0}>
        Deposit tokens
      </Button>
      <Modal open={modalOpen} onClose={handleModalClose} size="medium">
        <>
          <Typography variant="h5">Deposit tokens</Typography>
          <Alert
            severity="warning"
            action={
              <LoadingButton
                variant="contained"
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
              <Box sx={{ p: 4 }}>
                <Slider
                  size="small"
                  value={depositing}
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
                  onChange={(_, value) => setDepositing(value as number)}
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
                  value={depositing}
                  onChange={(e) => {
                    const inputValue = Number(e.target.value) < 0 ? 0 : Number(e.target.value);
                    setDepositing(inputValue > maxToOffer ? maxToOffer : inputValue);
                  }}
                />
              </Box>
              <Box sx={{ textAlign: "center", pt: 4 }}>
                <LoadingButton
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  disabled={depositing === 0}
                  onClick={handleDepositTokens}
                  loading={(isAwaitingConfirmation || isLoading) && type === BLOCKCHAIN_TRANSACTION_KEYS.DEPOSIT_NEOK}
                >
                  Deposit tokens
                </LoadingButton>
              </Box>
            </>
          )}
        </>
      </Modal>
    </>
  );
}
