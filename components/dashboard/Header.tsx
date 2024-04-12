import { useAccount } from "wagmi";

import { useState } from "react";

import { InfoOutlined } from "@mui/icons-material";
import { Alert, AlertColor, Chip, IconButton, Paper, Skeleton, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";

import { useFeatureFlags } from "@lib/feature-flags/useFeatureFlags";

import User from "@components/User";
import ElapsedTime from "@components/time-entry/ElapsedTime";

import useCurrentTasks from "@hooks/useCurrentTasks";
import useShareholderStatus from "@hooks/useShareholderStatus";
import useTimestamp from "@hooks/useTimestamp";
import useUser from "@hooks/useUser";

import Modal from "../Modal";

const messages: [number, string][] = [
  [22, "Working late 🦉"],
  [18, "Good evening 🌆"],
  [12, "Good afternoon 🌞"],
  [6, "Good morning 🐦"],
  [0, "Oh it's late 😴"],
];

const getVotingInfo = (percentage: number | null) => {
  if (percentage === null) {
    return {
      severity: "info",
      message: "You are not connected with your wallet or you haven't voted on any resolution this year",
    };
  }

  const preMessage = `You voted to ${Math.trunc(percentage)}% of the all votable resolutions this year`;
  if (percentage >= 70) {
    return {
      severity: "success",
      message: `${preMessage}. Keep it up!`,
    };
  }

  if (percentage > 51) {
    return {
      severity: "warning",
      message: `${preMessage}. Bear in mind you might be removed from the DAO if you vote to less than 51% of the resolutions during this year!`,
    };
  }

  return {
    severity: "error",
    message: `${preMessage}. You will be removed from the DAO if you vote to less than 51% of the resolutions during this year!`,
  };
};

export default function Header({ votingPercentageInTheYear }: { votingPercentageInTheYear: number | null }) {
  const { address } = useAccount();
  const { user } = useUser();
  const { isLoading, totalTime } = useCurrentTasks();
  const { currentTimestamp } = useTimestamp();
  const [infoOpen, setInfoOpen] = useState(false);

  const { getShareholderStatus } = useShareholderStatus();

  const featureFlags = useFeatureFlags();
  const isDeveloper = featureFlags.isDeveloper().get(false);

  const hr = currentTimestamp.getHours();
  const message = messages.find((msg) => hr >= msg[0]);
  const welcomeMessage = message ? message[1] : "Welcome";
  const { severity: votingSeverity, message: votingInfoMessage } = getVotingInfo(votingPercentageInTheYear);

  return (
    <>
      <Modal open={infoOpen} onClose={() => setInfoOpen(false)}>
        <Alert severity="info">
          Once the completed tasks will be approved, the corresponding tokens will be minted through the monthly
          resolution
        </Alert>
      </Modal>
      <Box sx={{ mr: 2, width: { xs: "100%", sm: "auto" }, mt: { xs: 4, md: 0 } }}>
        <Typography variant="h3" sx={{ pb: 2 }}>
          {welcomeMessage}
        </Typography>
        <User address={address || (user?.ethereum_address as string)} shouldMarkCurrentUser={false} />
        <Stack sx={{ pt: 2 }} spacing={1} direction="row">
          {isDeveloper && <Chip size="small" label={"Developer"} color={"info"}></Chip>}
          {getShareholderStatus(address || (user?.ethereum_address as string)).map((status) => (
            <Chip key={status} size="small" label={status} />
          ))}
        </Stack>
      </Box>
      <Paper sx={{ textAlign: "center", p: 2, ml: "auto", width: { xs: "100%", sm: "auto" }, mt: { xs: 4, sm: 0 } }}>
        {isLoading ? (
          <Box sx={{ width: 120 }}>
            <Typography variant="caption">
              <Skeleton />
            </Typography>
            <Typography variant="h4">
              <Skeleton />
            </Typography>
            <Typography variant="caption">
              <Skeleton />
            </Typography>
          </Box>
        ) : (
          <>
            {totalTime > 0 ? (
              <>
                <ElapsedTime elapsedTime={totalTime * 3600} withLabels hideSeconds />
                <Typography variant="caption">not tokenised, yet</Typography>
              </>
            ) : (
              <Typography variant="caption">All your tasks are approved</Typography>
            )}
            <IconButton color="primary" aria-label="info" size="small" onClick={() => setInfoOpen(true)}>
              <InfoOutlined />
            </IconButton>
          </>
        )}
      </Paper>

      <Alert severity={votingSeverity as AlertColor} sx={{ mt: 2, width: "100%" }}>
        {votingInfoMessage}
      </Alert>
    </>
  );
}
