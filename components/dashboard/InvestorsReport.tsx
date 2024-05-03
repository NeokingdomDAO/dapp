import useSWR from "swr";

import { useState } from "react";

import { InfoOutlined } from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { fetcher } from "@lib/net";
import { TOKEN_SYMBOL, moneyFormatter } from "@lib/utils";

import Modal from "@components/Modal";

import useGetInvestorsReportData from "@hooks/investors-report/useGetInvestorsReportData";

import Chart from "./Chart";

type ChartVizType = "default" | "accumulated";

const TOKEN_CMC_PAGE = {
  teledisko: "berlin",
  neokingdom: "neokingdom-dao",
  crowdpunk: "crowdp",
  vanilla: "vanilla",
}[process.env.NEXT_PUBLIC_PROJECT_KEY];

const TOKEN_API_ENDPOINT = `/api/token-price/${TOKEN_CMC_PAGE}`;

export default function InvestorsReport() {
  const {
    data: tokenPrice,
    isLoading: isLoadingGetTokenPrice,
    error: errorGettingTokenPrice,
  } = useSWR<{ priceEur: number; priceUsd: number }>(TOKEN_API_ENDPOINT, fetcher);
  const { data, dataAccumulated, isLoading, error } = useGetInvestorsReportData();
  const [chartType, setChartType] = useState<ChartVizType>("accumulated");
  const theme = useTheme();
  const [infoBox, setInfoBox] = useState<"internal" | "external" | null>(null);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (error || errorGettingTokenPrice) {
    return (
      <Alert severity="warning">
        <AlertTitle>Error</AlertTitle>
        An error occurred while fetching the investors report data. Please try again later.
      </Alert>
    );
  }

  if (isLoading || isLoadingGetTokenPrice) {
    return <CircularProgress />;
  }

  const handleChange = (event: SelectChangeEvent) => {
    setChartType(event.target.value as ChartVizType);
  };

  const chartData = chartType === "default" ? data : dataAccumulated;
  const totalSupply = dataAccumulated.slice(dataAccumulated.length - 1)[0]?.minted || 0;

  return (
    <>
      <Modal open={infoBox === "internal"} onClose={() => setInfoBox(null)}>
        <Alert severity="info">
          <AlertTitle sx={{ mb: 2, fontSize: 18 }}>Internal Value</AlertTitle>
          <Typography variant="body1">
            Internally within the DAO contributors may not gain or loose based on token price speculation. Hence the
            internal trading price of 1 {TOKEN_SYMBOL} is always 1Euro. <br />
            <br />
            The internal value simply represents the total value that has ever been put into the DAO by time or monetary
            contribution. <br />
            <br />
            The internal value is basically the accumulation of all tokens ever minted x 1 Euro. <br />
            <br />
            Internal value = total {TOKEN_SYMBOL} supply x 1EUR.
          </Typography>
        </Alert>
      </Modal>
      <Modal open={infoBox === "external"} onClose={() => setInfoBox(null)}>
        <Alert severity="info">
          <AlertTitle sx={{ mb: 2, fontSize: 18 }}>External Value</AlertTitle>
          <Typography variant="body1">
            The external value represents the value of the DAO based on the evaluation of external parties of what has
            been created by the DAO and its projected profits.
            <br />
            <br />
            External value = total {TOKEN_SYMBOL} supply x secondary market price of {TOKEN_SYMBOL} token. In
            traditional terms the external value could also be described as the: <i>&quot;market cap&quot;</i>.<br />
            <br />
            The price of the token ({tokenPrice?.priceEur} EUR, or {tokenPrice?.priceUsd} USD) is taken{" "}
            <Link
              href={`https://coinmarketcap.com/currencies/${TOKEN_CMC_PAGE}/`}
              rel="noopener noreferrer"
              target="_blank"
            >
              {" "}
              from coinmarketcap
            </Link>
            .
          </Typography>
        </Alert>
      </Modal>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        divider={<Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem />}
        spacing={4}
        alignItems="center"
        sx={{ textAlign: "center", mb: 2, mt: 2 }}
        justifyContent="center"
      >
        <Paper sx={{ p: 4, width: { xs: "100%", sm: "49%" }, position: "relative" }}>
          <IconButton
            color="primary"
            aria-label="info"
            size="small"
            onClick={() => setInfoBox("internal")}
            sx={{ position: "absolute", right: 12, top: 12 }}
          >
            <InfoOutlined />
          </IconButton>
          <Typography variant="h6">Internal Value</Typography>
          <Typography variant="caption">1 {TOKEN_SYMBOL} = 1 Euro</Typography>
          <Typography variant="h4" sx={{ pt: 2 }}>
            {moneyFormatter.format(totalSupply)}
          </Typography>
        </Paper>
        <Paper sx={{ p: 4, width: { xs: "100%", sm: "49%" }, position: "relative" }}>
          <IconButton
            color="primary"
            aria-label="info"
            size="small"
            onClick={() => setInfoBox("external")}
            sx={{ position: "absolute", right: 12, top: 12 }}
          >
            <InfoOutlined />
          </IconButton>
          <Typography variant="h6">External Market Value</Typography>
          <Typography variant="caption">
            1 {TOKEN_SYMBOL} = {tokenPrice?.priceEur} Euro
          </Typography>
          <Typography variant="h4" sx={{ pt: 2 }}>
            {moneyFormatter.format(totalSupply * (tokenPrice?.priceEur || 1))}
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
          <Chart data={chartData.slice(-12)} />
        </Box>
      </Paper>
    </>
  );
}
