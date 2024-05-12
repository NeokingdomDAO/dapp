import { useRouter } from "next/router";

import { useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

GenerateRedemptionInvoice.requireLogin = true;

export default function GenerateRedemptionInvoice() {
  const { query } = useRouter();
  const [vatLiable, setVatLiable] = useState(true);

  if (!query.neok || !query.usdt) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4">To generate the redemption invoice please fill in the form!</Typography>
      <form action="/api/pdf/redemption-invoice" method="post">
        <Box sx={{ mt: 3 }}>
          <TextField
            name="wallet-address"
            label="Wallet address"
            defaultValue={query.walletAddress}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
          />
        </Box>
        <Box sx={{ mt: 3 }}>
          <TextField
            name="usdt"
            label="Usdt"
            defaultValue={query.usdt}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
          />
        </Box>
        <Box sx={{ mt: 3 }}>
          <TextField
            name="neok"
            label="Neok"
            defaultValue={query.neok}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
          />
        </Box>
        <Box sx={{ mt: 3 }}>
          <TextField
            label="Invoice number"
            required
            name="invoice-number"
            fullWidth
            placeholder="Please use your own enumeration for the invoice number"
          />
        </Box>
        <Paper sx={{ p: 2, mt: 3 }}>
          <Box>
            <FormControlLabel
              control={<Switch checked={vatLiable} onChange={() => setVatLiable((old) => !old)} />}
              label="Are you VAT liable?"
              name="vat-liable"
            />
          </Box>
          {vatLiable && (
            <>
              <Box sx={{ mt: 3 }}>
                <TextField label="Registration number" required name="registration-number" fullWidth />
              </Box>
              <Box sx={{ mt: 3 }}>
                <TextField label="Your VAT number" name="vat-number" required fullWidth />
              </Box>
              <Box sx={{ mt: 3 }}>
                <FormControl required>
                  <FormLabel id="region-group-label">VAT region</FormLabel>
                  <RadioGroup aria-labelledby="region-group-label" defaultValue="eu" name="vat-region">
                    <FormControlLabel value="estonia" control={<Radio />} label="Estonia" />
                    <FormControlLabel value="eu" control={<Radio />} label="EU (non Estonia)" />
                    <FormControlLabel value="non-eu" control={<Radio />} label="Outside of EU" />
                  </RadioGroup>
                </FormControl>
              </Box>
            </>
          )}
        </Paper>
        <Box sx={{ mt: 3, mb: 3 }}>
          <TextField label="Your company address" name="company-info" multiline minRows={3} fullWidth required />
        </Box>
        <Button type="submit" variant="contained" size="large" fullWidth>
          Generate
        </Button>
      </form>
    </Container>
  );
}
