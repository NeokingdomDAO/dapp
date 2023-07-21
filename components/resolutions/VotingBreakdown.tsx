import { useMemo } from "react";
import { PieChart } from "react-minimal-pie-chart";

import { Alert, AlertTitle, Box, Divider, Stack, Typography, useTheme } from "@mui/material";

import { RESOLUTION_STATES } from "../../lib/resolutions/common";
import { ResolutionEntityEnhanced } from "../../types";
import Countdown from "../Countdown";
import useVoting from "./hooks/useVoting";

export default function VotingBreakdown({ resolution }: { resolution: ResolutionEntityEnhanced }) {
  const theme = useTheme();

  const { voting, outcome } = useVoting(resolution);

  return (
    <>
      {resolution.state === RESOLUTION_STATES.ENDED && (
        <Alert severity={resolution.hasQuorum ? "success" : "error"} sx={{ mt: 3, mb: 3 }}>
          {resolution.hasQuorum ? (
            <span>
              THE RESOLUTION OF SHAREHOLDERS{" "}
              <b>{resolution.isNegative ? "HAS NOT BEEN REJECTED" : "HAS BEEN ADOPTED"}</b> on{" "}
              {resolution.resolutionTypeInfo.votingEndsAt}. Shareholders did not submit dissenting opinions
            </span>
          ) : (
            <span>
              THE RESOLUTION OF SHAREHOLDERS{" "}
              <b>{resolution.isNegative ? "HAS BEEN REJECTED" : "HAS NOT BEEN ADOPTED"}</b>. Voting ended on{" "}
              {resolution.resolutionTypeInfo.votingEndsAt}. Shareholders did not submit dissenting opinions
            </span>
          )}
        </Alert>
      )}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Voting Summary:
      </Typography>
      {resolution.state === RESOLUTION_STATES.VOTING && (
        <Alert severity="info" sx={{ mt: 3, mb: 3 }}>
          <AlertTitle>Heads up</AlertTitle>
          Voting is still in progress.{" "}
          <Countdown targetDate={resolution.resolutionTypeInfo.votingEnds as Date} prefixLabel="Voting ends" inline />
        </Alert>
      )}
      <Stack
        direction="row"
        justifyContent="center"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={4}
        sx={{ pb: 4 }}
      >
        <Box sx={{ width: "20%", textAlign: "center" }}>
          <Typography variant="h6">Active votes</Typography>
          <Typography variant="body2">{Number(voting.totalVotedPerc)}%</Typography>
          <PieChart
            data={[{ value: Number(voting.totalVotedPerc), color: theme.palette.grey[600] }]}
            totalValue={100}
            lineWidth={20}
            labelPosition={0}
            startAngle={-90}
            animate
          />
        </Box>
        <Box sx={{ width: "25%", textAlign: "center" }}>
          <Typography variant="h6">Outcome</Typography>
          <Typography variant="body2">{outcome}</Typography>
          <PieChart
            data={[
              { title: "Yes", value: voting.totalVotedYes, color: theme.palette.success.main },
              { title: "No", value: voting.totalVotedNo, color: theme.palette.error.main },
            ]}
            lineWidth={20}
            segmentsStyle={{ transition: "stroke .3s", cursor: "pointer" }}
            animate
          />
        </Box>
      </Stack>
      <Typography variant="h6" sx={{ textAlign: "center", mb: 2, mt: 3 }}>
        Voting breakdown
      </Typography>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ textAlign: "center", "& > div": { width: "30%" } }}
      >
        <Box>
          <Typography variant="body1">Total</Typography>
          <Typography variant="caption">{voting.maxVotingPower.toLocaleString()} / 100%</Typography>
        </Box>
        <Box>
          <Typography variant="body1">In favour</Typography>
          <Typography variant="caption">
            {voting.totalVotedYes.toLocaleString()} /{" "}
            {Number(((100 * voting.totalVotedYes) / voting.maxVotingPower).toFixed(2))}%
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1">Against</Typography>
          <Typography variant="caption">
            {voting.totalVotedNo.toLocaleString()} /{" "}
            {Number(((100 * voting.totalVotedNo) / voting.maxVotingPower).toFixed(2))}%
          </Typography>
        </Box>
      </Stack>
      <Divider sx={{ mb: 2, pt: 2 }} />
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ textAlign: "center", "& > div": { width: "30%" } }}
      >
        <Box>
          <Typography variant="body1">Abstain</Typography>
          <Typography variant="caption">
            {voting.totalAbstained.toLocaleString()} /{" "}
            {Number(((100 * voting.totalAbstained) / voting.maxVotingPower).toFixed(2))}%
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1">Votes needed to approve</Typography>
          <Typography variant="caption">
            {Math.round((voting.maxVotingPower * Number(voting.quorum)) / 100).toLocaleString()} /{voting.quorum}%
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1">Threshold reached</Typography>
          <Typography variant="caption">{voting.hasQuorum ? "Yes" : "No"}</Typography>
        </Box>
      </Stack>
    </>
  );
}
