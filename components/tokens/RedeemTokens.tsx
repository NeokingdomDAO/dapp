import useSWR from "swr";

import { useState } from "react";

import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Slider,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import { BLOCKCHAIN_TRANSACTION_KEYS } from "@lib/constants";
import { fetcher } from "@lib/net";
import { calculateSteps } from "@lib/utils";

import useBlockchainTransactionStore from "@store/blockchainTransactionStore";

import ChangeableAddress from "@components/ChangeableAddress";

import useRedeemTokens from "@hooks/useRedeemTokens";

const GET_EURUSDT_ENDPOINT = "https://api.binance.com/api/v3/avgPrice?symbol=EURUSDT";

const getUsdtFromNeok = (neok: number, eurUsdt: number) =>
  Math.round((neok * Number(eurUsdt) + Number.EPSILON) * 100) / 100;

export default function RedeemTokens({ maxToRedeem }: { maxToRedeem: number }) {
  const [toRedeem, setToRedeem] = useState(0);
  const [redeemedTokensAmount, setRedeemedTokensAmount] = useState(0);
  const [address, setAddress] = useState("");

  const { onSubmit } = useRedeemTokens();
  const { data: eurUsdt, isLoading: isLoadingEurUsdt } = useSWR(GET_EURUSDT_ENDPOINT, fetcher);
  const { isAwaitingConfirmation, isLoading, type } = useBlockchainTransactionStore();
  const [shouldConfirm, setShouldConfirm] = useState(false);

  if (isLoadingEurUsdt) {
    return <CircularProgress />;
  }

  const handleRedeemTokens = async () => {
    const submitted = await onSubmit({ amount: toRedeem }); // TODO add address as soon as new contracts will be ready
    if (submitted) {
      setRedeemedTokensAmount(toRedeem);
      setToRedeem(0);
    }
  };

  if (redeemedTokensAmount > 0) {
    return (
      <>
        <Alert severity="success">{redeemedTokensAmount} tokens redeemed successfully!</Alert>
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            href={`/generate-redemption-invoice?neok=${redeemedTokensAmount}&usdt=${getUsdtFromNeok(
              redeemedTokensAmount,
              eurUsdt.price,
            )}&walletAddress=${address}`}
            sx={{ mt: 2 }}
            size="large"
          >
            Generate Invoice
          </Button>
        </Box>
      </>
    );
  }

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
          You will receive <b>{getUsdtFromNeok(toRedeem, eurUsdt.price)} axlUSDT</b>
          <br />
          <br />
          <b>Heads up:</b> After redeeming the tokens, you will be able to generate the invoice that you will need to
          send to Merike.
          <FormControlLabel
            sx={{ display: "block", p: 2 }}
            control={<Switch defaultChecked />}
            label="Understood"
            checked={shouldConfirm}
            onChange={() => setShouldConfirm((prev) => !prev)}
          />
        </Alert>
      )}
      {shouldConfirm && (
        <Box sx={{ textAlign: "center", pt: 2 }}>
          {toRedeem > 0 && (
            <>
              <ChangeableAddress address={address} setAddress={setAddress} label="Non whitelisted wallet address" />
              <LoadingButton
                fullWidth
                loading={(isAwaitingConfirmation || isLoading) && type === BLOCKCHAIN_TRANSACTION_KEYS.REDEEM_TOKENS}
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleRedeemTokens}
                disabled={address === ""}
              >
                Redeem Tokens
              </LoadingButton>
            </>
          )}
        </Box>
      )}
    </>
  );
}
