import { graphql } from "../generated";

export const getLegacyResolutionsQuery = graphql(`
  query GetLegacyResolutions {
    resolutions(orderBy: createTimestamp, orderDirection: desc) {
      ...legacyResolutionFragment
    }
  }
`);
