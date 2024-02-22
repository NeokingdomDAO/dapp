import { graphql } from "../generated";

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
