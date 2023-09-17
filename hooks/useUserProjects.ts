import useSWR from "swr";

import { useMemo } from "react";

import { fetcher } from "@lib/net";

export default function useUserProjects() {
  const { data: userProjects, isLoading } = useSWR<any>("/api/tasks", fetcher);

  const userTasks = useMemo(() => {
    if (!Array.isArray(userProjects) || userProjects.length === 0) {
      return [];
    }
    return userProjects.reduce(
      (acc: any[], project: any) => [
        ...acc,
        ...project.tasks.map((task: any) => ({
          ...task,
          projectName: project.name,
          projectId: project.id,
        })),
      ],
      [],
    );
  }, [userProjects]);

  return {
    userTasks,
    userProjects,
    isLoading,
  };
}
