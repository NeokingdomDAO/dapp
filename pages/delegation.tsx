import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import NextLink from "next/link";
import useSWR from "swr";
import { DaoUser } from "types";
import { useAccount } from "wagmi";
import { shallow } from "zustand/shallow";

import * as React from "react";
import { ReactElement } from "react";

import { CheckCircle, Warning } from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControlLabel,
  Grid,
  Link,
  Switch,
} from "@mui/material";

import { fetcher } from "@graphql/client";
import { getShareholdersInfo } from "@graphql/queries/get-shareholders-info.query";

import { isSameAddress } from "@lib/utils";

import useBlockchainTransactionStore from "@store/blockchainTransactionStore";
import useLoginModalStore from "@store/loginModal";

import User from "@components/User";

import useUser from "@hooks/useUser";

import UserCard from "../components/shareholders/UserCard";
import useDelegate from "../hooks/useDelegate";
import useDelegationStatus from "../hooks/useDelegationStatus";

const bigIntToNum = (bigIntNum: BigInt) => Number(formatEther(BigNumber.from(bigIntNum)));

Delegation.title = "Shareholders";
Delegation.requireLogin = true;

export default function Delegation() {
  const { user } = useUser();
  const { address: walletAddress } = useAccount();
  const { data, isLoading } = useSWR<any>(getShareholdersInfo, fetcher);
  const { data: delegationData, isLoading: delegationLoading } = useDelegationStatus();
  const [onlyManagingBoard, setOnlyManagingBoard] = React.useState(false);
  const { isLoading: isLoadingTransaction } = useBlockchainTransactionStore();
  const { onSubmit } = useDelegate();

  const { handleOpenLoginModalFromLink } = useLoginModalStore(
    (state) => ({
      handleOpenLoginModalFromLink: state.handleOpenLoginModalFromLink,
    }),
    shallow,
  );

  const getShareholderStatus = React.useCallback(
    (address: string) => {
      return [
        data.daoManager?.managingBoardAddresses.includes(address) && "ManagingBoard",
        data.daoManager?.shareholdersAddresses.includes(address) && "Shareholder",
        data.daoManager?.contributorsAddresses.includes(address) && "Contributor",
        data.daoManager?.investorsAddresses.includes(address) && "Investor",
      ].filter(Boolean);
    },
    [data],
  );

  const [daoUsers, daoUsersAddresses] = React.useMemo(() => {
    if (!data || !delegationData) {
      return [];
    }

    const totalVotingPower = bigIntToNum(data?.daoManager?.totalVotingPower || BigInt(0));

    const users = data?.daoUsers.reduce((computed: any, daoUser: DaoUser) => {
      const userVotingPower = bigIntToNum(daoUser.votingPower);
      computed[daoUser.address] = {
        power: ((100 * userVotingPower) / totalVotingPower).toFixed(2),
        canBeDelegated: delegationData.usersList.find((user) => isSameAddress(daoUser.address, user.address))
          ?.canBeDelegated,
      };
      return computed;
    }, {});

    const addresses = Object.keys(users)
      .filter((address) => getShareholderStatus(address).length > 0)
      .sort((userA, userB) => users[userB].power - users[userA].power);

    return [users, addresses];
  }, [data, delegationData, getShareholderStatus]);

  const handleDelegate = async (delegatingAddress: string, successElement: ReactElement, errorElement: ReactElement) =>
    onSubmit({ delegatingAddress, successElement, errorElement });

  if (isLoading || delegationLoading) {
    return <CircularProgress />;
  }

  return (
    <>
      <Alert severity="info" sx={{ mb: 2 }}>
        <AlertTitle>Delegation Information</AlertTitle>
        Delegating your voting power to someone else means that they can vote on resolutions using your voting power.
        This is useful if you want to be a passive DAO member. However, note that the person you delegate to can vote
        however they choose, without needing your consent for each vote. If you decide to vote on a specific proposal,
        your personal choice will override the delegated vote in the DAO system. You can also end the delegation any
        time. Using delegations is optional.
      </Alert>

      {delegationData?.signerDelegationStatus?.isDelegating && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              variant="outlined"
              onClick={() =>
                handleDelegate(
                  walletAddress as string,
                  <span>
                    Successfully removed{" "}
                    <User address={delegationData?.signerDelegationStatus.delegated as string} isInline />
                  </span>,
                  <span>
                    Error removing{" "}
                    <User address={delegationData?.signerDelegationStatus.delegated as string} isInline />
                  </span>,
                )
              }
              disabled={isLoadingTransaction}
            >
              Remove
            </Button>
          }
        >
          You are currently delegating to{" "}
          <User address={delegationData?.signerDelegationStatus?.delegated as string} isInline />
        </Alert>
      )}
      {delegationData?.signerDelegatedBy.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You are currently being delegated by{" "}
          {delegationData?.signerDelegatedBy.map((u, index) => (
            <span key={u.address}>
              <User address={u.address} isInline inlineVariant="caption" />
              {index < delegationData?.signerDelegatedBy.length - 2 && <span>, </span>}
              {index < delegationData?.signerDelegatedBy.length - 1 &&
                index >= delegationData?.signerDelegatedBy.length - 2 && <span> and </span>}
            </span>
          ))}{" "}
          and as a result, you cannot delegate
        </Alert>
      )}
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
            To see shareholders information, please{" "}
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
              !isSameAddress(userAddress, walletAddress as string) &&
              (!onlyManagingBoard ||
                (onlyManagingBoard && data.daoManager?.managingBoardAddresses.includes(userAddress))),
          )
          .map((userAddress) => {
            const { power, canBeDelegated } = daoUsers[userAddress];
            const isDelegatedByCurrentUser = delegationData?.signerDelegationStatus?.delegated === userAddress;
            const ctaCurrentUser = isDelegatedByCurrentUser ? (
              <Chip icon={<CheckCircle />} label="Delegated" variant="filled" color="success" size="small" />
            ) : null;
            const ctaCanBeDelegated =
              canBeDelegated && !ctaCurrentUser ? (
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    handleDelegate(
                      userAddress,
                      <span>
                        Successfully delegating <User address={userAddress as string} isInline />
                      </span>,
                      <span>
                        Error delegating <User address={userAddress as string} isInline />
                      </span>,
                    )
                  }
                  disabled={isLoadingTransaction}
                >
                  Delegate
                </Button>
              ) : (
                <Chip icon={<Warning />} label="Can't delegate" variant="outlined" color="warning" size="small" />
              );
            return (
              <Grid item xs={12} md={6} lg={4} key={userAddress}>
                <UserCard
                  address={userAddress}
                  power={power}
                  statuses={getShareholderStatus(userAddress)}
                  cta={ctaCurrentUser || ctaCanBeDelegated}
                />
              </Grid>
            );
          })}
      </Grid>
    </>
  );
}
