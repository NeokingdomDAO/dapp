import { graphql } from "gql";

export const getLegacyResolutionsQuery = graphql(`
  query GetLegacyResolutions {
    resolutions(orderBy: createTimestamp, orderDirection: desc) {
      ...legacyResolutionFragment
    }
  }
`);
