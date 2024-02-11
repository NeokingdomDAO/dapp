import { graphql } from "gql";

export const getResolutionsQuery = graphql(`
  query GetResolutions {
    resolutions(orderBy: createTimestamp, orderDirection: desc) {
      ...resolutionFragment
    }
  }
`);
