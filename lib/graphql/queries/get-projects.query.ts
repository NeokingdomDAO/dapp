import { gql } from "graphql-request";

export const getProjectsQuery = gql`
  query GetProjects($userId: Int!) {
    ProjectProject {
      id
      name
      description
      tag_ids {
        id
        name
      }
      tasks(domain: [["user_ids", "in", [$userId]]]) {
        id
        name
        write_date
        approval_user_id
        date_deadline
        tag_ids {
          id
          name
        }
        tier_id {
          id
          name
        }
      }
    }
  }
`;
