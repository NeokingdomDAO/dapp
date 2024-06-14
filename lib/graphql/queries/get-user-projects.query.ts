import { gql } from "graphql-request";

import { getStageId } from "@lib/constants";

import { projectTaskFragment } from "./project-task.fragment";

export const getUserProjectsQuery = gql`
  query getUserProjects($userId: Int!) {
    ProjectProject(domain: [["tasks.user_ids", "in", [$userId]]]) {
      id
      name
      description
      display_name
      tag_ids {
        id
        name
      }
      tasks(domain: [["user_ids.id", "in", [$userId]], ["parent_id", "=", false], ["stage_id.id", "!=", ${getStageId(
        "approved",
      )} ]]) {
        ...projectTaskFragment
        child_ids(domain: [["user_ids.id", "in", [$userId]], ["stage_id.id", "!=", ${getStageId("approved")} ]]) {
          ...projectTaskFragment
        }
      }
    }
  }

  ${projectTaskFragment}
`;
