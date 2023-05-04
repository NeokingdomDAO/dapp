import { useAccount } from "wagmi";

import { useState } from "react";
import SwipeableViews from "react-swipeable-views";

import { Alert, Badge, Box, CircularProgress, Tab, Tabs } from "@mui/material";

import OffersList from "@components/tokens/OffersList";
import UserActions from "@components/tokens/UserActions";
import UserBalance from "@components/tokens/UserBalance";

import useUserBalanceAndOffers from "@hooks/useUserBalanceAndOffers";

Tokens.title = "Tokens";
Tokens.requireLogin = true;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Tokens() {
  const [value, setValue] = useState(0);
  const { data, isLoading } = useUserBalanceAndOffers();
  const { isConnected } = useAccount();

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  if (!isConnected) {
    return <Alert severity="warning">Please connect your wallet to be able to visit this page</Alert>;
  }

  const activeOffersCount = (data?.activeOffers || []).length;
  const expiredOffersCount = (data?.expiredOffers || []).length;

  return (
    <>
      <UserBalance />
      <Alert severity="info" sx={{ mb: 2 }}>
        <strong>Governance Tokens</strong>provide holders with voting and dividend rights, but must be offered to
        contributors before becoming available for trading in the secondary market. <strong>NEOK Tokens</strong> do not
        possess these rights or limitations, allowing for unrestricted trading on the secondary market at any time.
      </Alert>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="tasks tabs">
          <Tab label="Actions" {...a11yProps(0)} />
          <Tab
            label={
              <Badge badgeContent={activeOffersCount} color="primary">
                Active offers
              </Badge>
            }
            {...a11yProps(1)}
            disabled={activeOffersCount === 0}
          />
          <Tab
            label={`Expired offers${expiredOffersCount > 0 ? ` (${expiredOffersCount})` : ""}`}
            {...a11yProps(1)}
            disabled={(data?.expiredOffers || []).length === 0}
          />
        </Tabs>
      </Box>
      <SwipeableViews index={value} onChangeIndex={handleChangeIndex}>
        <TabPanel value={value} index={0}>
          <UserActions />
        </TabPanel>
        <TabPanel value={value} index={1}>
          {isLoading ? <CircularProgress /> : <OffersList offers={data?.activeOffers || []} />}
        </TabPanel>
        <TabPanel value={value} index={2}>
          {isLoading ? <CircularProgress /> : <OffersList offers={data?.expiredOffers || []} />}
        </TabPanel>
      </SwipeableViews>
    </>
  );
}
