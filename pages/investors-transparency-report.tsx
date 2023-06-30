import { Box, Typography } from "@mui/material";

import InvestorsReport from "@components/dashboard/InvestorsReport";

InvestorsTransparencyReport.noLayout = true;
InvestorsTransparencyReport.customCss = `
  body {
    background-color: transparent !important;
  }
`;

export default function InvestorsTransparencyReport() {
  return (
    <Box component="main" sx={{ p: 3 }}>
      <Typography variant="h3" sx={{ mb: 4 }}>
        Investors Transparency Report
      </Typography>
      <InvestorsReport />
    </Box>
  );
}
