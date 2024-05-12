import { graphql } from "../../generated";

export const resolutionFragment = graphql(`
  fragment resolutionFragment on Resolution {
    id
    hash
    isNegative
    resolutionType {
      ...resolutionTypeFragment
    }
    yesVotesTotal
    createTimestamp
    updateTimestamp
    approveTimestamp
    rejectTimestamp
    executionTimestamp
    createBy
    updateBy
    approveBy
    rejectBy
    hasQuorum
    executionTo
    executionData
    addressedContributor
    voters {
      id
      address
      votingPower
      hasVoted
      hasVotedYes
      delegated
    }
  }
`);
