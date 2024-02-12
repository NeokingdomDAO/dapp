import { graphql } from "gql";

export const getDelegationUsers = graphql(`
  query GetDelegationUsers {
    delegationUsers {
      id
      address
      delegated
    }
  }
`);
