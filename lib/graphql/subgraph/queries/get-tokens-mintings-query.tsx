import { graphql } from "../generated";

export const getTokenMintings = graphql(`
  query GetTokenMintings {
    tokenMintings {
      id
      amounts
      mintedTimestamp
    }
  }
`);
