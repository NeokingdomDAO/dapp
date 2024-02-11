import { graphql } from "gql";

export const getLegacyResolutionQuery = graphql(`
  query GetLegacyResolution($id: ID!) {
    resolution(id: $id) {
      ...legacyResolutionFragment
    }
  }
`);
