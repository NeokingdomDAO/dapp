import { gql } from "graphql-request";

export const getUserRedemption = gql`
  query GetUserRedemption($userId: String!) {
    redemptions(where: { createBy: $userId }) {
      id
      amount
      createBy
      updateTimestamp
      endTimestamp
      startTimestamp
      redemptionHistory {
        id
        amount
        timestamp
      }
    }
  }
`;
