import { useState } from "react";

import {
  Box,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { moneyFormatter } from "@lib/utils";

import useGetInvestorsReportData from "@hooks/investors-report/useGetInvestorsReportData";

import Chart from "./Chart";

type ChartVizType = "default" | "accumulated";

export default function InvestorsReport() {
  const { data, dataAccumulated, isLoading } = useGetInvestorsReportData();
  const [chartType, setChartType] = useState<ChartVizType>("accumulated");
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (isLoading) {
    return <CircularProgress />;
  }

  const handleChange = (event: SelectChangeEvent) => {
    setChartType(event.target.value as ChartVizType);
  };

  const chartData = chartType === "default" ? data : dataAccumulated;
  const totalSupply = dataAccumulated.slice(dataAccumulated.length - 1)[0]?.minted;

  return (
    <>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        divider={<Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem />}
        spacing={4}
        alignItems="center"
        sx={{ textAlign: "center", mb: 2, mt: 2 }}
        justifyContent="center"
      >
        <Paper sx={{ p: 4, width: { xs: "100%", sm: "49%" } }}>
          <Typography variant="h6">Internal Value</Typography>
          <Typography variant="caption">1 NEOK = 1 Euro</Typography>
          <Typography variant="h4" sx={{ pt: 2 }}>
            {moneyFormatter.format(totalSupply)}
          </Typography>
        </Paper>
        <Paper sx={{ p: 4, width: { xs: "100%", sm: "49%" } }}>
          <Typography variant="h6">External Market Value</Typography>
          <Typography variant="caption">1 NEOK = 1 Euro</Typography>
          <Typography variant="h4" sx={{ pt: 2 }}>
            {moneyFormatter.format(totalSupply)}
          </Typography>
        </Paper>
      </Stack>
      <Divider sx={{ mt: 4, mb: 4 }} />
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between">
          <div>
            <Typography variant="h6">Growth rate</Typography>
            <Typography variant="caption">Tokens minted in the last 12 months</Typography>
          </div>
          <FormControl>
            <InputLabel id="select-type">Type</InputLabel>
            <Select labelId="select-type" value={chartType} label="Type" onChange={handleChange}>
              <MenuItem value="default">Distinct</MenuItem>
              <MenuItem value="accumulated">Accumulated</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Box sx={{ height: 350 }}>
          <Chart data={chartData} />
        </Box>
      </Paper>
    </>
  );
}
