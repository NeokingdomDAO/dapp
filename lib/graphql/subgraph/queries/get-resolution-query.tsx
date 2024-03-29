import { graphql } from "../generated";

export const getResolutionQuery = graphql(`
  query GetResolution($id: ID!) {
    resolution(id: $id) {
      ...resolutionFragment
    }
  }
`);
