import { graphql } from "../generated";

export const getDelegationUsers = graphql(`
  query GetDelegationUsers {
    delegationUsers {
      id
      address
      delegated
    }
  }
`);
