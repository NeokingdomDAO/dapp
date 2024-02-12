import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { DaoUser } from "gql/graphql";
import NextLink from "next/link";
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
  Typography,
} from "@mui/material";

import { getShareholdersInfo } from "@graphql/queries/subgraph/get-shareholders-info-query";

import { useGraphQL } from "@lib/graphql/useGraphql";
import { isSameAddress } from "@lib/utils";

import useBlockchainTransactionStore from "@store/blockchainTransactionStore";
import useLoginModalStore from "@store/loginModal";

import Dialog from "@components/Dialog";
import User from "@components/User";

import useGetActiveResolutions from "@hooks/useGetActiveResolutions";
import useUser from "@hooks/useUser";

import UserCard from "../components/shareholders/UserCard";
import useDelegate from "../hooks/useDelegate";
import useDelegationStatus from "../hooks/useDelegationStatus";
import { ShareholderStatus } from "../types";

const bigIntToNum = (bigIntNum: BigInt) => Number(formatEther(BigNumber.from(bigIntNum)));

Delegation.title = "Shareholders";
Delegation.requireLogin = true;
Delegation.checkMismatch = true;

export default function Delegation() {
  const { user } = useUser();
  const { address: walletAddress } = useAccount();
  const { data, isLoading, error } = useGraphQL(getShareholdersInfo);
  const { data: delegationData, isLoading: delegationLoading } = useDelegationStatus();
  const [onlyManagingBoard, setOnlyManagingBoard] = React.useState(false);
  const { isLoading: isLoadingTransaction } = useBlockchainTransactionStore();
  const { onSubmit } = useDelegate();
  const { activeResolutionsWarning, votingResolutions, noticeResolutions } = useGetActiveResolutions();
  const [activeDelegatingAddress, setActiveDelegatingAddress] = React.useState<string | null>(null);

  const { handleOpenLoginModalFromLink } = useLoginModalStore(
    (state) => ({
      handleOpenLoginModalFromLink: state.handleOpenLoginModalFromLink,
    }),
    shallow,
  );

  const getShareholderStatus = React.useCallback(
    (address: string): ShareholderStatus[] => {
      return [
        data?.daoManager?.managingBoardAddresses.includes(address) && "ManagingBoard",
        data?.daoManager?.shareholdersAddresses.includes(address) && "Shareholder",
        data?.daoManager?.contributorsAddresses.includes(address) && "Contributor",
        data?.daoManager?.investorsAddresses.includes(address) && "Investor",
      ].filter(Boolean) as ShareholderStatus[];
    },
    [data],
  );

  const [daoUsers, daoUsersAddresses] = React.useMemo(() => {
    if (!data || !delegationData) {
      return [];
    }

    const totalVotingPower = bigIntToNum(data?.daoManager?.totalVotingPower || BigInt(0));

    const users = data?.daoUsers.reduce(
      (computed: { [id: string]: { power: string; canBeDelegated: boolean | undefined } }, daoUser) => {
        const userVotingPower = bigIntToNum(daoUser.votingPower);
        computed[daoUser.address] = {
          power: ((100 * userVotingPower) / totalVotingPower).toFixed(2),
          canBeDelegated: delegationData.usersList.find((user) => isSameAddress(daoUser.address, user.address))
            ?.canBeDelegated,
        };
        return computed;
      },
      {},
    );

    const addresses = Object.keys(users)
      .filter((address) => getShareholderStatus(address).length > 0)
      .sort((userA, userB) => users[userB].power.localeCompare(users[userA].power));

    return [users, addresses];
  }, [data, delegationData, getShareholderStatus]);

  const handleDelegate = async (delegatingAddress: string, successElement: ReactElement, errorElement: ReactElement) =>
    onSubmit({ delegatingAddress, successElement, errorElement });

  const getResolutionsNumbers = () =>
    [
      votingResolutions?.length
        ? `${votingResolutions?.length} voting resolution${votingResolutions?.length > 1 ? "s" : ""}`
        : null,
      noticeResolutions?.length
        ? `${noticeResolutions?.length} notice resolution${noticeResolutions?.length > 1 ? "s" : ""}`
        : null,
    ]
      .filter(Boolean)
      .join(" and ");

  if (error) {
    return null;
  }

  if (isLoading || delegationLoading) {
    return <CircularProgress />;
  }

  return (
    <>
      <Dialog
        open={!!activeDelegatingAddress}
        handleClose={() => setActiveDelegatingAddress(null)}
        disabledConfirm={isLoadingTransaction}
        handleApprove={async () => {
          await handleDelegate(
            activeDelegatingAddress as string,
            <span>
              Successfully removed <User address={activeDelegatingAddress as string} isInline />
            </span>,
            <span>
              Error removing <User address={activeDelegatingAddress as string} isInline />
            </span>,
          );
          setActiveDelegatingAddress(null);
        }}
        title="Heads up"
        descriptionId="dialog-delegate"
        confirmLabel="Yes, proceed"
      >
        <Typography variant="body1">
          Delegation will work only for <b>newly created resolutions</b>. As there are currently active resolutions (
          {getResolutionsNumbers()}), you will need to vote yourself for those!
          <br />
          <br />
          Proceed delegating to <User address={activeDelegatingAddress as string} isInline />?
        </Typography>
      </Dialog>
      <Alert severity="info" sx={{ mb: 2 }}>
        <AlertTitle>Delegation Information</AlertTitle>
        Delegating your voting power to someone else means that they can vote on resolutions using your voting power.
        <br />
        This is a useful tool if you are going offline for some time (e.g. long holidays) or you want to become a
        passive DAO member. <br />
        <br />
        However, you need to bear in mind the following features of delegations: <br />
        a) delegation applies only to resolutions that are announced after you have delegated your voting power
        (delegation does not apply to votings that have already be announced by that time);
        <br />
        b) the person you delegated to can vote however he/she chooses, without needing your consent for each vote;
        <br />
        c) if the person you have delegated to, is excluded from a specific voting, your delegation is neglected;
        <br />
        d) if the person you have delegated to looses its voting rights, your delegation is neglected;
        <br />
        e) you can always vote and your vote overrules any delegated voting on your behalf;
        <br />
        f) delegation applies to all the votings that are announced before the cancellation of the delegation
        (delegation is in force with respect of votings announced before the cancellation of the delegation);
        <br />
        g) if you fail to vote in the adoption of at least 51% of the resolutions of the calendar year (resolutions
        submitted in a negative manner shall not be taken into account), you be suspended from voting rights for an
        indefinite term by a resolution of the shareholders.
        <br />
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
                (onlyManagingBoard && data?.daoManager?.managingBoardAddresses.includes(userAddress))),
          )
          .map((userAddress) => {
            if (!daoUsers) return;
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
                  onClick={() => {
                    if (activeResolutionsWarning) {
                      setActiveDelegatingAddress(userAddress);
                      return;
                    }
                    handleDelegate(
                      userAddress,
                      <span>
                        Successfully delegating <User address={userAddress as string} isInline />
                      </span>,
                      <span>
                        Error delegating <User address={userAddress as string} isInline />
                      </span>,
                    );
                  }}
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
