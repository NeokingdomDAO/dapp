import { gql } from "graphql-request";

export const getTasksQuery = gql`
  query GetTasks($userId: Int!) {
    ProjectTask(domain: [["user_id", "=", $userId]]) {
      id
      display_name
    }
  }
`;
