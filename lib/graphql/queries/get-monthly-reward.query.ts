import { gql } from "graphql-request";

export const getMonthlyRewardQuery = gql`
  query GetMonthlyReward($startDate: String!, $endDate: String!) {
    AccountAnalyticLine(domain: [["approval_date", ">=", $startDate], ["approval_date", "<=", $endDate]]) {
      approval_date
      start
      end
      name
      unit_amount
      token_amount
      user_id {
        id
        name
        email
        ethereum_address
      }
      task_id {
        id
        approval_date
      }
    }
  }
`;
