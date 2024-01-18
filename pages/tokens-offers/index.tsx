import { useAccount } from "wagmi";

import { useState } from "react";
import SwipeableViews from "react-swipeable-views";

import { Alert, Badge, Box, CircularProgress, Link, Tab, Tabs } from "@mui/material";

import OffersList from "@components/tokens/OffersList";
import Redemption from "@components/tokens/Redemption";
import UserActions from "@components/tokens/UserActions";
import UserBalance from "@components/tokens/UserBalance";

import useUserBalanceAndOffers, { bigIntToNum } from "@hooks/useUserBalanceAndOffers";

Tokens.title = "Tokens";
Tokens.requireLogin = true;
Tokens.checkMismatch = true;

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
  const { data, isLoading, error } = useUserBalanceAndOffers();
  const { isConnected } = useAccount();

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  if (error) {
    return null;
  }

  if (!isConnected) {
    return <Alert severity="warning">Please connect your wallet to be able to visit this page</Alert>;
  }

  const activeOffersCount = (data?.activeOffers || []).filter((offer) => bigIntToNum(offer.amount) > 0).length;

  return (
    <>
      <UserBalance />
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="tasks tabs">
          <Tab label="Tokens" {...a11yProps(0)} />
          <Tab
            label={
              <Badge badgeContent={activeOffersCount} color="primary">
                Active offers
              </Badge>
            }
            {...a11yProps(1)}
          />
          <Tab label="Expired offers" {...a11yProps(2)} />
          <Tab label="Redemption" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <SwipeableViews index={value} onChangeIndex={handleChangeIndex}>
        <TabPanel value={value} index={0}>
          <UserActions />
        </TabPanel>
        <TabPanel value={value} index={1}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <OffersList offers={data?.activeOffers || []} noOffersMessage="No active offers" />
          )}
        </TabPanel>
        <TabPanel value={value} index={2}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <OffersList offers={data?.expiredOffers || []} noOffersMessage="No expired offers" />
          )}
        </TabPanel>
        <TabPanel value={value} index={3}>
          {value === 3 ? <Redemption /> : null}
        </TabPanel>
      </SwipeableViews>
    </>
  );
}
