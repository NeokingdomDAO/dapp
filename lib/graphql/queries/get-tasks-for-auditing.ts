import { gql } from "graphql-request";

export const getTasksForAuditing = gql`
  query GetTasksForAuditing($limit: Number! = 50, $offset: Number! = 0) {
    ProjectTask(
      domain: [
        ["approval_date", "=", false]
        ["child_ids", "=", false]
        "|"
        ["subtask_effective_hours", ">", 0]
        ["effective_hours", ">", 0]
      ]
      order: "write_date DESC"
    ) {
      subtask_effective_hours
      effective_hours
      name
      write_date
      project_id {
        name
      }
      parent_id {
        name
      }
      user_id {
        id
        name
        ethereum_address
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
  }
`;
