import useSWR from "swr";

import { useMemo } from "react";

import { fetcher } from "@lib/net";

import { Project, ProjectTask } from "@store/projectTaskStore";

export default function useUserProjects() {
  const { data: userProjects, isLoading } = useSWR<Project[]>("/api/tasks", fetcher);
  const projectsWithTasks = useMemo(
    () => userProjects?.filter((project) => project.tasks.length) || [],
    [userProjects],
  );

  const userTasks = useMemo(() => {
    if (!Array.isArray(projectsWithTasks) || projectsWithTasks.length === 0) {
      return [];
    }
    return projectsWithTasks.reduce(
      (acc: any[], project: any) => [
        ...acc,
        ...project.tasks
          .filter((task: ProjectTask) => task.child_ids.length === 0)
          .map((task: ProjectTask) => ({
            ...task,
            projectName: project.name,
            projectId: project.id,
          })),
      ],
      [],
    );
  }, [projectsWithTasks]);

  return {
    userTasks,
    userProjects,
    isLoading,
  };
}
