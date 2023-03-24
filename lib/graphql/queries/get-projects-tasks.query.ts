import { gql } from "graphql-request";

import { STAGE_TO_ID_MAP } from "../../constants";
import { projectTaskFragment } from "./project-task.fragment";

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
      tasks(domain: [["user_ids", "in", [$userId]], ["stage_id.id", "!=", ${STAGE_TO_ID_MAP["approved"]} ]]) {
        ...projectTaskFragment
        child_ids(domain: [["stage_id.id", "!=", ${STAGE_TO_ID_MAP["approved"]}]]) {
          ...projectTaskFragment
        }
      }
    }
  }

  ${projectTaskFragment}
`;
