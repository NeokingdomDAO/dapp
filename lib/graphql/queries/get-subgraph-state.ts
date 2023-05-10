import { gql } from "graphql-request";

export const getSubgraphState = gql`
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
`;
