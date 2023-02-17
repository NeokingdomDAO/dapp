import { gql } from "graphql-request";

export const getUsersQuery = gql`
  query GetUsers {
    ResUsers {
      id
      email
      name
      display_name
      ethereum_address
      avatar_256
    }
  }
`;
