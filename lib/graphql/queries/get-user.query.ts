import { gql } from "graphql-request";

export const getUserQuery = gql`
  query GetUser($email: String!) {
    ResUsers(domain: [["email", "=", $email]]) {
      id
      email
      name
      display_name
      ethereum_address
    }
  }
`;
