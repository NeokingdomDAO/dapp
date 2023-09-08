import { ResolutionEntityEnhanced } from "types";

import { useMemo } from "react";

export default function useVoting(resolution: ResolutionEntityEnhanced) {
  const voting = useMemo(() => {
    const totalVotedYes = resolution.votingStatus.votersHaveVotedYes.reduce(
      (total, voter) => voter.votingPowerInt + total,
      0,
    );

    const totalVotedNo = resolution.votingStatus.votersHaveVotedNo.reduce(
      (total, voter) => voter.votingPowerInt + total,
      0,
    );

    const totalAbstained = resolution.votingStatus.votersHaveNotVoted.reduce(
      (total, voter) => voter.votingPowerInt + total,
      0,
    );

    const base = {
      quorum: resolution.resolutionType.quorum,
      hasQuorum: resolution.hasQuorum,
      isNegative: resolution.isNegative,
      totalVotedYes: totalVotedYes,
      totalVotedNo: totalVotedNo + totalAbstained,
      totalAbstained,
      totalVoted:
        resolution.votingStatus.votersHaveVoted.reduce((total, voter) => voter.votingPowerInt + total, 0) +
        totalAbstained,
      maxVotingPower: resolution.voters.reduce((total, voter) => total + voter.votingPowerInt, 0),
      usersVotedYes: resolution.votingStatus.votersHaveVotedYes.length,
      usersVotedNo: resolution.votingStatus.votersHaveVotedNo.length,
      usersTotal: resolution.voters.length,
      usersVoted: resolution.votingStatus.votersHaveVoted.length,
    };

    return {
      ...base,
      totalVotedPerc: ((100 * (base.totalVoted - base.totalAbstained)) / (base.maxVotingPower || 1)).toFixed(2),
      totalVotedYesPerc: ((100 * base.totalVotedYes) / (base.totalVoted || 1)).toFixed(2),
      totalVotedNoPerc: ((100 * base.totalVotedNo) / (base.totalVoted || 1)).toFixed(2),
    };
  }, [resolution]);

  const outcome = [
    Number(voting.totalVotedYesPerc) > 0 && `${Number(voting.totalVotedYesPerc)}% In Favour`,
    Number(voting.totalVotedNoPerc) > 0 && `${Number(voting.totalVotedNoPerc)}% Against`,
  ]
    .filter(Boolean)
    .join(" - ");

  return { voting, outcome };
}
