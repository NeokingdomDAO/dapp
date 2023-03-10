import { useMemo } from "react";
import { PieChart } from "react-minimal-pie-chart";

import { Alert, AlertTitle, Box, Divider, Stack, Typography, useTheme } from "@mui/material";

import { RESOLUTION_STATES } from "../../lib/resolutions/common";
import { ResolutionEntityEnhanced } from "../../types";
import Countdown from "../Countdown";

export default function VotingBreakdown({ resolution }: { resolution: ResolutionEntityEnhanced }) {
  const theme = useTheme();

  const voting = useMemo(() => {
    const base = {
      quorum: resolution.resolutionType.quorum,
      hasQuorum: resolution.hasQuorum,
      isNegative: resolution.isNegative,
      totalVotedYes: resolution.votingStatus.votersHaveVotedYes.reduce(
        (total, voter) => voter.votingPowerInt + total,
        0,
      ),
      totalVotedNo: resolution.votingStatus.votersHaveVotedNo.reduce((total, voter) => voter.votingPowerInt + total, 0),
      totalAbstained: resolution.votingStatus.votersHaveNotVoted.reduce(
        (total, voter) => voter.votingPowerInt + total,
        0,
      ),
      totalVoted: resolution.votingStatus.votersHaveVoted.reduce((total, voter) => voter.votingPowerInt + total, 0),
      maxVotingPower: resolution.voters.reduce((total, voter) => total + voter.votingPowerInt, 0),
      usersVotedYes: resolution.votingStatus.votersHaveVotedYes.length,
      usersVotedNo: resolution.votingStatus.votersHaveVotedNo.length,
      usersTotal: resolution.voters.length,
      usersVoted: resolution.votingStatus.votersHaveVoted.length,
    };

    return {
      ...base,
      totalVotedPerc: ((100 * base.totalVoted) / (base.maxVotingPower || 1)).toFixed(2),
      totalVotedYesPerc: ((100 * base.totalVotedYes) / (base.totalVoted || 1)).toFixed(2),
      totalVotedNoPerc: ((100 * base.totalVotedNo) / (base.totalVoted || 1)).toFixed(2),
    };
  }, [resolution]);

  const outcome = [
    Number(voting.totalVotedYesPerc) > 0 && `${Number(voting.totalVotedYesPerc)}% Yes`,
    Number(voting.totalVotedNoPerc) > 0 && `${Number(voting.totalVotedNoPerc)}% No`,
  ]
    .filter(Boolean)
    .join(" - ");

  return (
    <>
      {resolution.state === RESOLUTION_STATES.ENDED && (
        <Alert severity={resolution.hasQuorum ? "success" : "error"} sx={{ mt: 3, mb: 3 }}>
          {resolution.hasQuorum ? (
            <span>
              THE RESOLUTION OF SHAREHOLDERS <b>HAS BEEN</b> ADOPTED on {resolution.resolutionTypeInfo.votingEndsAt}
            </span>
          ) : (
            <span>
              THE RESOLUTION OF SHAREHOLDERS <b>HAS NOT BEEN</b> ADOPTED. Voting ended on{" "}
              {resolution.resolutionTypeInfo.votingEndsAt}
            </span>
          )}
        </Alert>
      )}
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
          <Typography variant="h6">Voters</Typography>
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
        Breakdown
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
          <Typography variant="body1">{voting.isNegative ? "Negative" : ""} Votes needed to approve</Typography>
          <Typography variant="caption">
            {Math.round((voting.maxVotingPower * Number(voting.quorum)) / 100).toLocaleString()} /{voting.quorum}%
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1">Quorum reached</Typography>
          <Typography variant="caption">{voting.hasQuorum ? "Yes" : "No"}</Typography>
        </Box>
      </Stack>
    </>
  );
}
