import { graphql } from "gql";

export const getResolutionTypesQuery = graphql(`
  query GetResolutionTypes {
    resolutionTypes {
      ...resolutionTypeFragment
    }
  }
`);
