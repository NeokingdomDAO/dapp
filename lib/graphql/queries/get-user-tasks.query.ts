import { gql } from "graphql-request";

export const getUserTasksQuery = gql`
  query GetUserTasks($user_id: Int!) {
    ProjectTask(domain: [["user_id", "=", $user_id]]) {
      id
      name
      stage_id {
        id
        name
      }
      project_id {
        id
        name
      }
    }
  }
`;
