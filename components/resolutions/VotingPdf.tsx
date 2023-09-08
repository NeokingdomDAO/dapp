import { Text } from "@react-pdf/renderer";
import { ResolutionEntityEnhanced } from "types";

import { Bold, Br } from "./Pdf";
import useVoting from "./hooks/useVoting";

export default function VotingPdf({ resolution }: { resolution: ResolutionEntityEnhanced }) {
  const { voting, outcome } = useVoting(resolution);
  return (
    <>
      <Text style={{ fontSize: "18px", marginTop: "8px" }}>Voting breakdown:</Text>
      <Text style={{ fontSize: "12px", marginTop: 8 }}>
        <Bold>Active votes:</Bold> {Number(voting.totalVotedPerc)}%<Br />
        <Bold>Outcome:</Bold> {outcome}
        <Br />
        <Bold>Total:</Bold> <Text>{voting.maxVotingPower.toLocaleString()} / 100%</Text>
        <Br />
        <Bold>In favour:</Bold>{" "}
        <Text>
          {voting.totalVotedYes.toLocaleString()} /{" "}
          {Number(((100 * voting.totalVotedYes) / voting.maxVotingPower).toFixed(2))}%
        </Text>
        <Br />
        <Bold>Against:</Bold>{" "}
        <Text>
          {voting.totalVotedNo.toLocaleString()} /{" "}
          {Number(((100 * voting.totalVotedNo) / voting.maxVotingPower).toFixed(2))}%
        </Text>
        <Br />
        <Bold>Abstain:</Bold>{" "}
        <Text>
          {voting.totalAbstained.toLocaleString()} /{" "}
          {Number(((100 * voting.totalAbstained) / voting.maxVotingPower).toFixed(2))}%
        </Text>
        <Br />
        <Bold>{resolution.isNegative ? "Against votes" : "Yes votes"} needed to approve:</Bold>{" "}
        <Text>
          {Math.round((voting.maxVotingPower * Number(voting.quorum)) / 100).toLocaleString()} / {voting.quorum}%
        </Text>
        <Br />
        <Bold>Threshold reached:</Bold> <Text>{voting.hasQuorum ? "Yes" : "No"}</Text>
      </Text>
    </>
  );
}
