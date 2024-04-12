import { useAccount } from "wagmi";

import { Box, Chip, Stack, Typography, alpha } from "@mui/material";

import { RESOLUTION_STATES } from "@lib/resolutions/common";
import { isSameAddress } from "@lib/utils";

import useUser from "@hooks/useUser";

import { ResolutionEntityEnhanced, ResolutionState } from "../types";

const STATE_TO_COLOR: Record<ResolutionState, any> = {
  ended: "default",
  notice: "warning",
  voting: "error",
  "pre-draft": "info",
  rejected: "error",
};

const STATE_TO_VARIANT: Record<ResolutionState, "outlined" | "filled"> = {
  ended: "outlined",
  notice: "filled",
  voting: "outlined",
  "pre-draft": "outlined",
  rejected: "filled",
};

export default function ResolutionInfo({
  resolution,
  hideState = false,
  chipSize = "medium",
  scrollGradient = true,
}: {
  resolution: ResolutionEntityEnhanced;
  hideState?: boolean;
  scrollGradient?: boolean;
  chipSize?: "medium" | "small";
}) {
  const { address, isConnected } = useAccount();
  const { user } = useUser();

  const canVote =
    address || user?.ethereum_address
      ? resolution.voters.find((voter) => isSameAddress(voter.address, address || (user?.ethereum_address as string)))
      : null;

  const votingUser =
    canVote && (address || user?.ethereum_address)
      ? resolution.votingStatus.votersHaveVoted.find((voter) =>
          isSameAddress(voter.address, address || (user?.ethereum_address as string)),
        )
      : null;

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        whiteSpace: "nowrap",
        overflow: "auto",
        scrollbarWidth: "none",
        ...(scrollGradient && {
          "&::-webkit-scrollbar": { display: "none" },
          "&:after": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            width: 16,
            height: "100%",
            background: (t) =>
              `linear-gradient(to right, ${alpha(t.palette.grey["100"], 0)}, ${alpha(t.palette.grey["100"], 1)})`,
            ['[data-mui-color-scheme="dark"] &']: {
              background: (t) =>
                `linear-gradient(to right, ${alpha(t.palette.grey["900"], 0)}, ${alpha(t.palette.grey["900"], 1)})`,
            },
          },
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: 16,
            height: "100%",
            background: (t) =>
              `linear-gradient(to left, ${alpha(t.palette.grey["100"], 0)}, ${alpha(t.palette.grey["100"], 1)})`,
            ['[data-mui-color-scheme="dark"] &']: {
              background: (t) =>
                `linear-gradient(to left, ${alpha(t.palette.grey["900"], 0)}, ${alpha(t.palette.grey["900"], 1)})`,
            },
          },
        }),
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          whiteSpace: "nowrap",
          overflow: "auto",
          width: "100%",
          pr: 2,
          pl: 2,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {canVote &&
          !votingUser &&
          RESOLUTION_STATES.ENDED === resolution.state &&
          (isConnected || user?.isLoggedIn) && (
            <Chip size={chipSize} sx={{ mr: hideState ? 0 : 2 }} label="Abstained, counts as No" variant="outlined" />
          )}
        {votingUser && (isConnected || user?.isLoggedIn) && (
          <>
            <Typography variant="body2">Your Vote: </Typography>
            <Chip
              sx={{ ml: 0.5, mr: hideState ? 0 : 2 }}
              size={chipSize}
              label={votingUser.hasVotedYes ? "Yes" : "No"}
              variant="outlined"
            />
          </>
        )}
        {!hideState && (
          <>
            <Typography variant="body2">Resolution Type: </Typography>
            <Chip
              variant="outlined"
              label={`${resolution.resolutionType.name} ${resolution.isNegative ? " (veto)" : ""}`}
              sx={{ ml: 0.5 }}
              size={chipSize}
            />
            <Typography variant="body2" sx={{ ml: 2 }}>
              Resolution Status:{" "}
            </Typography>
            <Chip
              size={chipSize}
              sx={{ ml: 0.5 }}
              label={resolution.state}
              color={STATE_TO_COLOR[resolution.state]}
              variant={STATE_TO_VARIANT[resolution.state]}
            />
          </>
        )}
      </Stack>
    </Box>
  );
}
