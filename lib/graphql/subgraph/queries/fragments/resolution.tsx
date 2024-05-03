import { graphql } from "../../generated";

export const resolutionFragment = graphql(`
  fragment resolutionFragment on Resolution {
    id
    title
    content
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
    metadata {
      isMonthlyRewards
    }
  }
`);

export const legacyResolutionFragment = graphql(`
  fragment legacyResolutionFragment on Resolution {
    id
    title
    content
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
