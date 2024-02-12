import { graphql } from "gql";

export const resolutionTypeFragment = graphql(`
  fragment resolutionTypeFragment on ResolutionType {
    id
    name
    quorum
    noticePeriod
    votingPeriod
    canBeNegative
  }
`);
