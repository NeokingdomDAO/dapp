import { graphql } from "../generated";

export const getLegacyResolutionQuery = graphql(`
  query GetLegacyResolution($id: ID!) {
    resolution(id: $id) {
      ...legacyResolutionFragment
    }
  }
`);
