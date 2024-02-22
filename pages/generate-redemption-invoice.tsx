import { useRouter } from "next/router";

import { useState } from "react";

import { Box, Button, CircularProgress, Container, TextField, Typography } from "@mui/material";

export default function GenerateRedemptionInvoice() {
  const { query } = useRouter();
  const [invoiceData, setInvoiceData] = useState({ invoiceNumber: "", companyInfo: "", vatNumber: "" });

  if (!query.neok || !query.usdt) {
    return <CircularProgress />;
  }
  return (
    <Container maxWidth="sm">
      <Typography variant="h4">To generate the redemption invoice please fill in the form!</Typography>
      <form action="/api/pdf/redemption-invoice" method="post">
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
            value={invoiceData.invoiceNumber}
            onChange={(evt) => setInvoiceData((d) => ({ ...d, invoiceNumber: evt.target.value }))}
            fullWidth
            placeholder="Please use your own enumeration for the invoice number"
          />
        </Box>
        <Box sx={{ mt: 3 }}>
          <TextField
            label="Your VAT number"
            name="vat-number"
            required
            value={invoiceData.vatNumber}
            onChange={(evt) => setInvoiceData((d) => ({ ...d, vatNumber: evt.target.value }))}
            fullWidth
          />
        </Box>
        <Box sx={{ mt: 3, mb: 3 }}>
          <TextField
            label="Your company information and address"
            name="company-info"
            multiline
            minRows={3}
            value={invoiceData.companyInfo}
            onChange={(evt) => setInvoiceData((d) => ({ ...d, companyInfo: evt.target.value }))}
            fullWidth
            required
          />
        </Box>
        <Button type="submit" variant="contained" size="large" fullWidth>
          Generate
        </Button>
      </form>
    </Container>
  );
}
