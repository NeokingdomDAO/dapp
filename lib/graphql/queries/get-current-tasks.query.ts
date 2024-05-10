import { gql } from "graphql-request";

import { getStageId } from "@lib/constants";

export const getCurrentTasks = gql`
  query GetCurrentTasks($userId: String!) {
    ProjectTask(
      domain: [
        ["user_id", "=", $userId]
        ["child_ids", "=", false]
        ["stage_id.id", "!=", ${getStageId("approved")}]
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
        id
        name
      }
      parent_id {
        name
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
