import { gql } from "graphql-request";

import { resolutionTypeFragment } from "./resolution-type.fragment";

export const resolutionFragment = gql`
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
      address
      votingPower
      hasVoted
      hasVotedYes
      delegated
    }
  }

  ${resolutionTypeFragment}
`;
