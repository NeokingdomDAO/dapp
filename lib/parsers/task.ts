const STAGES = {
  29: "backlog",
  30: "progress",
  31: "done",
  32: "approved",
} as const;

type OdooTask = {
  id: string;
  user_id: [number, string];
  name: string;
  description: string;
  child_ids?: number[];
  stage_id: [keyof typeof STAGES, string];
  parent_id: number;
  durations: { id: number }[];
  task_id: [number, string];
  project_id: [number, string];
  tier: [number, string];
  write_date: string;
};

type OdooDuration = {
  id: string;
  task_id: [number, string];
  start: string;
  end: string;
  unit_amount: number;
  name: string;
};

type OdooProject = {
  id: string;
  name: string;
  sequence: string;
  task_ids: number[];
};

function parseDate(s: string) {
  return s ? new Date(s.replace(" ", "T") + "Z") : false;
}

export function parseTask(task: OdooTask) {
  const upstreamStage = STAGES[task.stage_id[0]];
  const stage = ["backlog", "progress"].includes(upstreamStage) ? "todo" : upstreamStage;
  const stages = new Set([stage]);
  return {
    id: task.id,
    userId: task.user_id[0],
    name: task.name,
    description: task.description,
    isTracking: false,
    isParentTask: task.child_ids && task.child_ids.length > 0 && !task.parent_id,
    isSingleTask: task.child_ids?.length === 0 && !task.parent_id,
    isSubtask: !!task.parent_id,
    subtaskIds: task.child_ids,
    hasSubtasks: task.child_ids && task.child_ids?.length > 0,
    hasDurations: task.durations?.length > 0,
    parentId: task.task_id ? task.task_id[0] : null,
    durations: task.durations.map((duration) => duration.id),
    projectId: task.project_id[0],
    projectName: task.project_id[1],
    tier: task.tier && task.tier[1],
    tierId: task.tier && task.tier[0],
    lastUpdate: parseDate(task.write_date),
    lastActivity: 0,
    stage,
    stages,
  };
}

export function parseDuration(duration: OdooDuration) {
  return {
    id: duration.id,
    taskId: duration.task_id[0],
    start: parseDate(duration.start),
    end: parseDate(duration.end),
    hours: duration.unit_amount,
    description: duration.name,
  };
}

export function parseProject(project: OdooProject) {
  return {
    id: project.id,
    name: project.name,
    sequence: project.sequence,
    taskIds: project.task_ids,
    isTracking: false,
    stages: new Set(),
    stagesCount: {
      todo: 0,
      done: 0,
    },
  };
}
