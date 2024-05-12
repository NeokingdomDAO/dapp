import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import { shallow } from "zustand/shallow";

import { useMemo, useState } from "react";

import { LoadingButton } from "@mui/lab";
import { Alert, AlertTitle, Box, Button, ButtonGroup, CircularProgress, Link, Stack, Typography } from "@mui/material";

import { isSameAddress } from "@lib/utils";

import useBlockchainTransactionStore from "@store/blockchainTransactionStore";
import useLoginModalStore from "@store/loginModal";

import useResolutionVote from "@hooks/useResolutionVote";
import useResolutionsAcl from "@hooks/useResolutionsAcl";

import { ResolutionEntityEnhanced } from "../types";
import Countdown from "./Countdown";
import User from "./User";

export default function VotingWidget({ resolution }: { resolution: ResolutionEntityEnhanced }) {
  const { address, isConnected } = useAccount();
  const { acl, isLoading: isLoadingAcl } = useResolutionsAcl();
  const [votingYes, setVotingYes] = useState(false);
  const { onSubmit } = useResolutionVote();
  const { open: openWeb3Modal } = useWeb3Modal();
  const { isLoading } = useBlockchainTransactionStore();

  const { handleOpenLoginModalFromLink } = useLoginModalStore(
    (state) => ({
      handleOpenLoginModalFromLink: state.handleOpenLoginModalFromLink,
    }),
    shallow,
  );

  const votingUser = address
    ? resolution.votingStatus.votersHaveVoted.find((voter) => isSameAddress(voter.address, address))
    : null;

  const [votingOnBehalfOf, delegatedTo] = useMemo(() => {
    if (!address) {
      return [[], null];
    }
    const votingOnBehalfOf = resolution.voters.filter(
      (user) => !isSameAddress(user.address, address) && isSameAddress(user.delegated, address),
    );
    const delegatedTo =
      resolution.voters.find(
        (user) => isSameAddress(user.address, address) && !isSameAddress(user.delegated, address),
      ) || null;
    return [votingOnBehalfOf, delegatedTo];
  }, [resolution, address]);

  const handleVote = (votedYes: boolean) => {
    setVotingYes(votedYes);
    return onSubmit({
      resolutionId: resolution.id,
      votedYes,
    });
  };

  if (isLoadingAcl) {
    <CircularProgress />;
  }

  if (!isConnected) {
    return (
      <Alert
        severity="warning"
        action={
          <Button variant="outlined" color="warning" size="small" onClick={() => openWeb3Modal()}>
            Connect Wallet
          </Button>
        }
      >
        You should connect your wallet in order to vote
      </Alert>
    );
  }

  if (!acl.canVote(resolution.voters)) {
    return <Alert severity="warning">You&apos;re not entitled to vote for this resolution</Alert>;
  }

  if (isSameAddress(address as string, resolution.addressedContributor)) {
    return <Alert severity="warning">You&apos;re excluded from voting for this resolution</Alert>;
  }

  if (!isConnected) {
    return (
      <Button onClick={handleOpenLoginModalFromLink} variant="outlined" href="/login">
        Connect wallet to vote
      </Button>
    );
  }
  if (!acl.canVote(resolution.voters)) {
    return <Alert severity="warning">You don&apos;t have voting right for this resolution</Alert>;
  }

  return (
    <>
      {resolution.isNegative && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <AlertTitle>Heads up</AlertTitle>
          This is a <b>veto resolution</b>. You can either abstain or vote &quot;NO&quot; in order to make it pass.
        </Alert>
      )}
      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" justifyContent="center">
        <Typography variant="body1" sx={{ whiteSpace: "nowrap" }}>
          {votingUser ? "You have voted" : "Cast your vote"}
        </Typography>
        <ButtonGroup size="large" aria-label="large button group">
          <LoadingButton
            sx={{ borderTopLeftRadius: 18, borderBottomLeftRadius: 18, width: 100 }}
            color={votingUser?.hasVotedYes ? "success" : "primary"}
            variant={votingUser?.hasVotedYes ? "contained" : "outlined"}
            onClick={() => (!votingUser?.hasVotedYes ? handleVote(true) : null)}
            loading={votingYes && isLoading}
          >
            Yes
          </LoadingButton>
          <LoadingButton
            sx={{ borderTopRightRadius: 18, borderBottomRightRadius: 18, width: 100 }}
            color={votingUser?.hasVoted && !votingUser?.hasVotedYes ? "error" : "primary"}
            variant={votingUser?.hasVoted && !votingUser?.hasVotedYes ? "contained" : "outlined"}
            onClick={() => (!votingUser?.hasVoted || votingUser?.hasVotedYes ? handleVote(false) : null)}
            loading={!votingYes && isLoading}
          >
            No
          </LoadingButton>
        </ButtonGroup>
      </Stack>
      <Alert severity="info" sx={{ mt: 2 }}>
        <Countdown targetDate={resolution.resolutionTypeInfo.votingEnds as Date} prefixLabel="Voting ends" inline />
      </Alert>
      {(votingOnBehalfOf?.length || 0) > 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Voting also on behalf of&nbsp;
          {votingOnBehalfOf?.map((user, index) => (
            <span key={user.address}>
              <User isInline address={user.address} />
              {index < votingOnBehalfOf.length - 2 && <span>, </span>}
              {index < votingOnBehalfOf.length - 1 && index >= votingOnBehalfOf.length - 2 && <span> and </span>}
            </span>
          ))}
        </Alert>
      )}
      {delegatedTo && (
        <Alert severity="info" sx={{ mt: 2 }}>
          You&apos;re delegating your vote for this resolution to <User isInline address={delegatedTo.delegated} />. You
          can still vote if you want. Doing so will override the delegation.
        </Alert>
      )}
    </>
  );
}
