import { Text, View } from "@react-pdf/renderer";
import { ResolutionEntityEnhanced, ResolutionVoter } from "types";

import { isSameAddress } from "@lib/utils";

import { Bold, Br } from "./Pdf";
import { sortByVotingPower } from "./VotingUsers";

const getPOAText = (voter: ResolutionVoter, getUserName: (address: string) => string) => {
  if (!voter.usedPoa) return "No";
  if (voter.delegating) {
    return `Yes, Delegated to ${getUserName(voter.delegating.address)}`;
  }
  if (voter.beingDelegatedBy.length > 0) {
    const delegatedBy = voter.beingDelegatedBy.map((u) => getUserName(u.address)).join(", ");
    return `Yes, Being delegated by ${delegatedBy}`;
  }
};

export default function ShareholdersPdf({
  resolution,
  getUserName,
}: {
  resolution: ResolutionEntityEnhanced;
  getUserName: (address: string) => string;
}) {
  return (
    <>
      <Text style={{ fontSize: "18px", marginBottom: "4px", marginTop: "8px" }}>
        List of shareholders and their positions:
      </Text>
      {resolution.voters.sort(sortByVotingPower).map((voter) => {
        const percOfAll = (
          (100 * voter.votingPowerInt) /
          resolution.voters.reduce((total, voter) => total + voter.votingPowerInt, 0)
        ).toFixed(2);
        return (
          <View
            key={voter.id}
            style={{ borderBottom: "1px solid #DEDEDE", fontSize: "12px", paddingBottom: "8px", marginBottom: "8px" }}
            wrap={false}
          >
            <Text style={{ marginBottom: "3px" }}>
              <Bold>{getUserName(voter.address)}</Bold> <Text style={{ fontSize: "10px" }}>{voter.address}</Text>
            </Text>
            <Br />
            {isSameAddress(resolution.addressedContributor, voter.address) ? (
              <Text>This contributor is excluded from voting</Text>
            ) : (
              <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                {voter.hasVoted ? <Text>Voted: {voter.hasVotedYes ? "Yes" : "No"}</Text> : <Text>Voted: Abstain</Text>}
                <Text>&nbsp;- </Text>
                <Text>Tokens (# Votes): {voter.votingPowerInt.toLocaleString()}</Text>
                <Text>&nbsp;- </Text>
                <Text>% of all votes: {Number(percOfAll)}%</Text>
                <Text>&nbsp;- </Text>
                <Text>PoA was used: {getPOAText(voter, getUserName)}</Text>
              </View>
            )}
          </View>
        );
      })}
    </>
  );
}
