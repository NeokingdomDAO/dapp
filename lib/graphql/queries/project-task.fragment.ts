import { gql } from "graphql-request";

export const projectTaskFragment = gql`
  fragment projectTaskFragment on ProjectTask {
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
    parent_id {
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
    timesheet_ids {
      id
      name
      display_name
      unit_amount
      start
      end
    }
  }
`;
