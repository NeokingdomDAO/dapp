import { gql } from "graphql-request";

export const getTiersQuery = gql`
  query GetTiers {
    AccountAnalyticTier {
      id
      name
    }
  }
`;
