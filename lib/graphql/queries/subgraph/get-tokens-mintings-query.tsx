import { graphql } from "gql";

export const getTokenMintings = graphql(`
  query GetTokenMintings {
    tokenMintings {
      id
      amounts
      mintedTimestamp
    }
  }
`);
