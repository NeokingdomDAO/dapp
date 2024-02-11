import { graphql } from "gql";

export const getResolutionQuery = graphql(`
  query GetResolution($id: ID!) {
    resolution(id: $id) {
      ...resolutionFragment
    }
  }
`);
