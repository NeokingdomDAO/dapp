import { graphql } from "gql";

export const getSubgraphState = graphql(`
  query GetSubgraphState {
    state: _meta {
      hasIndexingErrors
      block {
        hash
        timestamp
        number
      }
    }
  }
`);
