import { useState } from "react";

import { CloseRounded } from "@mui/icons-material";
import { Alert, Box, Button, IconButton, InputAdornment, TextField } from "@mui/material";

export default function ChangeableAddress({
  initialAddress,
  address,
  setAddress,
}: {
  initialAddress: string | undefined;
  address: string;
  setAddress: (a: string) => void;
}) {
  const [changeAddress, setChangeAddress] = useState(false);

  const handleSetChangeAddress = () => {
    setChangeAddress(true);
    setTimeout(() => {
      document.getElementById("address")?.focus();
    }, 100);
  };

  const handleResetSetChangeAddress = () => {
    setChangeAddress(false);
    setAddress(String(initialAddress));
  };

  return (
    <Box sx={{ mt: 4 }}>
      {changeAddress ? (
        <TextField
          id="address"
          label="Withdrawal address"
          type="text"
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="toggle back" onClick={handleResetSetChangeAddress} edge="end">
                  <CloseRounded />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      ) : (
        <Alert
          severity="info"
          action={
            <Button size="small" variant="outlined" onClick={handleSetChangeAddress}>
              Change
            </Button>
          }
        >
          By default you will receive your tokens on the address: <b>{initialAddress}</b>
        </Alert>
      )}
    </Box>
  );
}
