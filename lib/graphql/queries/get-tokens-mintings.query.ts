import { gql } from "graphql-request";

export const getTokenMintings = gql`
  query GetTokenMintings {
    tokenMintings {
      id
      amounts
      mintedTimestamp
    }
  }
`;
