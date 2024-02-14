import { graphql } from "../generated";

export const getResolutionsQuery = graphql(`
  query GetResolutions {
    resolutions(orderBy: createTimestamp, orderDirection: desc) {
      ...resolutionFragment
    }
  }
`);
