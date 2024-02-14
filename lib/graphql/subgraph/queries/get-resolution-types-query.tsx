import { graphql } from "../generated";

export const getResolutionTypesQuery = graphql(`
  query GetResolutionTypes {
    resolutionTypes {
      ...resolutionTypeFragment
    }
  }
`);
