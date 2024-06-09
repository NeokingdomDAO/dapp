import useSWR from "swr";

import { useMemo } from "react";

import { fetcher } from "@lib/net";

import { Project, ProjectTask } from "@store/projectTaskStore";

export default function useUserProjects() {
  const { data: userProjects, isLoading } = useSWR<Project[]>("/api/tasks", fetcher);

  const projectsWithTasks = useMemo(
    () => userProjects?.filter((project) => project.task_ids.length) || [],
    [userProjects],
  );

  const userTasks = useMemo(() => {
    if (!Array.isArray(projectsWithTasks) || projectsWithTasks.length === 0) {
      return [];
    }

    return projectsWithTasks
      .reduce(
        (acc: any[], project) => [
          ...acc,
          ...project.task_ids.map((task) => {
            if (task.child_ids.length === 0) {
              return {
                ...task,
                projectName: project.name,
                projectId: project.id,
              };
            }
            return (
              task.child_ids.map((subTask: ProjectTask) => ({
                ...subTask,
                projectName: project.name,
                projectId: project.id,
              })) || []
            );
          }),
        ],
        [],
      )
      .flat();
  }, [projectsWithTasks]);

  return {
    userTasks,
    userProjects,
    isLoading,
  };
}
