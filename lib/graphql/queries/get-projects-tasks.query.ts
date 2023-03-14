import { gql } from "graphql-request";

export const getProjectsTasksQuery = gql`
  query GetProjectsTasks($projectIds: [Int]!, $userId: Int!) {
    ProjectProject(domain: [["id", "in", $projectIds]]) {
      id
      name
      description
      display_name
      tag_ids {
        id
        name
      }
      task_count
      task_count_with_subtasks
      tasks(domain: [["user_id", "=", $userId]]) {
        id
        name
        display_name
        description
        effective_hours
        date_deadline
        write_date
        user_id {
          id
          name
        }
        approval_user_id {
          id
          name
        }
        tier_id {
          id
          name
        }
        tag_ids {
          id
          name
        }
        project_id {
          id
        }
        stage_id {
          id
          name
        }
        child_ids {
          id
          name
          display_name
          description
          project_id {
            id
          }
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
            start
            end
          }
        }
        # parent_id {
        #  id
        #  name
        # }
        timesheet_ids {
          id
          name
          display_name
          unit_amount
          start
          end
        }
      }
    }
  }
`;
