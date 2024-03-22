import { Box, TextField } from "@mui/material";

export default function ChangeableAddress({
  address,
  setAddress,
  label,
}: {
  address: string;
  label?: string;
  setAddress: (a: string) => void;
}) {
  return (
    <Box sx={{ mt: 4 }}>
      <TextField
        id="address"
        label={label || "Withdrawal address"}
        type="text"
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
        value={address}
        onChange={(e) => {
          setAddress(e.target.value);
        }}
      />
    </Box>
  );
}
