import { gql } from "graphql-request";

import { getStageId } from "@lib/constants";

export const getTasksForAuditing = gql`
  query GetTasksForAuditing($limit: Number! = 50, $offset: Number! = 0) {
    ProjectTask(
      domain: [
        ["user_ids", "in", [$userId]]
        ["effective_hours", ">", 0]
        ["stage_id.id", "!=", ${getStageId("approved")}]
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
        tier_id
      }
    }
  }
`;
