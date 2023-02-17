import { gql } from "graphql-request";

export const getUserByAddressQuery = gql`
  query GetUser($address: String!) {
    ResUsers(domain: [["ethereum_address", "=", $address]]) {
      id
      email
      name
      display_name
      ethereum_address
    }
  }
`;
