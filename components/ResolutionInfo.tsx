import { useAccount } from "wagmi";

import { Chip, Stack, Typography } from "@mui/material";

import { isSameAddress } from "@lib/utils";

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
}: {
  resolution: ResolutionEntityEnhanced;
  hideState?: boolean;
  chipSize?: "medium" | "small";
}) {
  const { address } = useAccount();
  const votingUser = address
    ? resolution.votingStatus.votersHaveVoted.find((voter) => isSameAddress(voter.address, address))
    : null;
  return (
    <Stack direction="row" alignItems="center">
      <Typography variant="body2">Resolution Type: </Typography>
      <Chip
        variant="outlined"
        label={`${resolution.resolutionType.name} ${resolution.isNegative ? " (veto)" : ""}`}
        sx={{ ml: 0.5 }}
        size={chipSize}
      />
      {!hideState && (
        <>
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
      {votingUser && (
        <>
          <Typography variant="body2" sx={{ ml: 2, "@media print": { display: "none" } }}>
            Your Vote:{" "}
          </Typography>
          <Chip
            size={chipSize}
            sx={{ ml: 0.5, "@media print": { display: "none" } }}
            label={votingUser.hasVotedYes ? "Yes" : "No"}
            variant="outlined"
          />
        </>
      )}
    </Stack>
  );
}
