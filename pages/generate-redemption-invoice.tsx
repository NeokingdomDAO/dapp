import { useRouter } from "next/router";

import { useState } from "react";

import { Box, Button, Container, TextField, Typography } from "@mui/material";

export default function GenerateRedemptionInvoice() {
  const { query } = useRouter();
  const [invoiceData, setInvoiceData] = useState({ invoiceNumber: "", companyInfo: "", vatNumber: "" });
  return (
    <Container maxWidth="sm">
      <Typography variant="h4">To generate the redemption invoice please fill in the form!</Typography>
      <form action="/api/generate-redemption-invoice" method="post">
        <Box sx={{ mt: 3 }}>
          <TextField disabled label="Usdt" value={query.usdt} fullWidth />
        </Box>
        <Box sx={{ mt: 3 }}>
          <TextField disabled label="Neok" value={query.neok} fullWidth />
        </Box>
        <Box sx={{ mt: 3 }}>
          <TextField
            label="Invoice number"
            required
            value={invoiceData.invoiceNumber}
            onChange={(evt) => setInvoiceData((d) => ({ ...d, invoiceNumber: evt.target.value }))}
            fullWidth
            placeholder="Please use your own enumeration for the invoice number"
          />
        </Box>
        <Box sx={{ mt: 3 }}>
          <TextField
            label="VAT number"
            required
            value={invoiceData.vatNumber}
            onChange={(evt) => setInvoiceData((d) => ({ ...d, vatNumber: evt.target.value }))}
            fullWidth
          />
        </Box>
        <Box sx={{ mt: 3, mb: 3 }}>
          <TextField
            label="Your company information and address"
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
