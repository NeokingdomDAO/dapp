import useSWR from "swr";

import { useState } from "react";

import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, CircularProgress, Slider, TextField, Typography } from "@mui/material";

import { BLOCKCHAIN_TRANSACTION_KEYS } from "@lib/constants";
import { fetcher } from "@lib/net";
import { calculateSteps } from "@lib/utils";

import useBlockchainTransactionStore from "@store/blockchainTransactionStore";

import useRedeemTokens from "@hooks/useRedeemTokens";

const GET_EURUSDT_ENDPOINT = "https://api.binance.com/api/v3/avgPrice?symbol=EURUSDT";

export default function RedeemTokens({ closeModal, maxToRedeem }: { closeModal: () => void; maxToRedeem: number }) {
  const [toRedeem, setToRedeem] = useState(0);

  const { onSubmit } = useRedeemTokens();
  const { data: eurUsdt, isLoading: isLoadingEurUsdt } = useSWR(GET_EURUSDT_ENDPOINT, fetcher);
  const { isAwaitingConfirmation, isLoading, type } = useBlockchainTransactionStore();

  if (isLoadingEurUsdt) {
    return <CircularProgress />;
  }

  const handleRedeemTokens = async () => {
    const submitted = await onSubmit({ amount: toRedeem });
    if (submitted) {
      closeModal();
      setToRedeem(0);
    }
  };

  return (
    <>
      <Typography variant="h5">Redeem tokens</Typography>
      <Box sx={{ p: 4 }}>
        <Slider
          size="small"
          value={toRedeem}
          max={maxToRedeem}
          aria-label="Small"
          valueLabelDisplay="auto"
          step={calculateSteps(maxToRedeem)}
          marks={[
            {
              value: maxToRedeem,
              label: "Max to redeem",
            },
          ]}
          onChange={(_, value) => setToRedeem(value as number)}
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
          value={toRedeem}
          onChange={(e) => {
            const inputValue = Number(e.target.value) < 0 ? 0 : Number(e.target.value);
            setToRedeem(inputValue > maxToRedeem ? maxToRedeem : inputValue);
          }}
        />
      </Box>
      {toRedeem > 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          You will receive {Math.round((toRedeem * Number(eurUsdt.price) + Number.EPSILON) * 100) / 100} axlUSDT
        </Alert>
      )}
      <Box sx={{ textAlign: "center", pt: 2 }}>
        <LoadingButton
          fullWidth
          loading={(isAwaitingConfirmation || isLoading) && type === BLOCKCHAIN_TRANSACTION_KEYS.REDEEM_TOKENS}
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          disabled={toRedeem === 0}
          onClick={handleRedeemTokens}
        >
          Redeem Tokens
        </LoadingButton>
      </Box>
    </>
  );
}
