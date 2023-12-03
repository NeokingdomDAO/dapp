import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box, CircularProgress, Paper, Stack, Typography } from "@mui/material";

import useUserBalanceAndOffers from "@hooks/useUserBalanceAndOffers";

const PAPER_SX = {
  p: 4,
  borderRadius: 3,
  width: "50%",
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  justifyContent: "center",
  textAlign: "center",
};

const ELLIPSIS_SX = {
  width: "100%",
  textOverflow: "ellipsis",
  overflow: "hidden",
  whitespace: "nowrap",
  fontSize: {
    md: "2.5rem",
  },
};

export default function UserBalance() {
  const { data, isLoading } = useUserBalanceAndOffers();

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ position: "relative" }}>
      <Stack direction="row" justifyContent="center" spacing={1} sx={{ pb: 4 }}>
        <Paper sx={PAPER_SX}>
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            Your internal governance tokens
          </Typography>
          <Typography variant="h6" sx={ELLIPSIS_SX}>
            {data?.balance.governanceTokens}
          </Typography>
        </Paper>
      </Stack>
    </Box>
  );
}
