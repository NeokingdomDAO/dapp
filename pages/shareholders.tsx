import NextLink from "next/link";
import { shallow } from "zustand/shallow";

import * as React from "react";

import { Alert, Box, CircularProgress, FormControlLabel, Grid, Link, Switch } from "@mui/material";

import useLoginModalStore from "@store/loginModal";

import UserCard from "@components/shareholders/UserCard";

import useShareholderStatus from "@hooks/useShareholderStatus";
import useUser from "@hooks/useUser";

Shareholders.title = "Shareholders";

export default function Shareholders() {
  const { user } = useUser();
  const [onlyManagingBoard, setOnlyManagingBoard] = React.useState(false);

  const { handleOpenLoginModalFromLink } = useLoginModalStore(
    (state) => ({
      handleOpenLoginModalFromLink: state.handleOpenLoginModalFromLink,
    }),
    shallow,
  );

  const { isLoading, daoUsersAddresses, daoUsers, getShareholderStatus } = useShareholderStatus();

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <FormControlLabel
          sx={{ ml: "auto" }}
          control={<Switch checked={onlyManagingBoard} onChange={() => setOnlyManagingBoard((old) => !old)} />}
          label="Show only managing board"
        />
      </Box>
      {!user?.isLoggedIn && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="warning">
            To be able to see shareholders information, please{" "}
            <Link component={NextLink} href="/login" onClick={handleOpenLoginModalFromLink}>
              log in
            </Link>
          </Alert>
        </Box>
      )}
      <Grid container spacing={2}>
        {daoUsersAddresses
          ?.filter(
            (userAddress) =>
              !onlyManagingBoard || (onlyManagingBoard && getShareholderStatus(userAddress).includes("ManagingBoard")),
          )
          .map((userAddress) => (
            <Grid item xs={12} md={6} lg={4} key={userAddress}>
              <UserCard
                address={userAddress}
                power={daoUsers[userAddress].power}
                statuses={getShareholderStatus(userAddress)}
              />
            </Grid>
          ))}
      </Grid>
    </>
  );
}
