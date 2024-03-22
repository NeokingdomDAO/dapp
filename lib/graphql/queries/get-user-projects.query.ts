import { gql } from "graphql-request";

import { projectTaskFragment } from "./project-task.fragment";

export const getUserProjectsQuery = gql`
  query getUserProjects($userId: Int!) {
    ProjectProject(domain: [["tasks.user_ids.id", "in", [$userId]]]) {
      id
      name
      description
      display_name
      tag_ids {
        id
        name
      }
      tasks(domain: [["user_ids.id", "in", [$userId]]]) {
        ...projectTaskFragment
        child_ids {
          ...projectTaskFragment
        }
      }
    }
  }

  ${projectTaskFragment}
`;