import { graphql } from "../generated";

export const getUserRedemption = graphql(`
  query GetUserRedemption($userId: Bytes!) {
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
`);
