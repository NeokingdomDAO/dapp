import { gql } from "graphql-request";

export const getProjectsTasksQuery = gql`
  query GetProjectsTasks($userId: Int!) {
    ProjectProject(domain: [["user_id", "=", $userId]]) {
      id
      name
      description
      display_name
      tag_ids
      task_count
      task_count_with_subtasks
      tasks {
        id
        name
        display_name
        description
        effective_hours
        stage_id {
          id
          name
        }
        child_ids {
          id
          name
          display_name
          description
          parent_id {
            id
            name
          }
          stage_id {
            id
            name
          }
          timesheet_ids {
            id
            name
            display_name
            unit_amount
          }
        }
        parent_id {
          id
          name
        }
        timesheet_ids {
          id
          name
          display_name
          unit_amount
        }
      }
    }
  }
`;
