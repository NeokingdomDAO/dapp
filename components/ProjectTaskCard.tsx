import { Card, CardContent, CardHeader } from "@mui/material";

import { ProjectTask } from "@store/projectTaskStore";

import { STAGE_TO_ID_MAP } from "../lib/constants";
import ProjectSubTask from "./ProjectSubTask";

export default function ProjectTaskCard({ task, hideCompleted }: { task: ProjectTask; hideCompleted?: boolean }) {
  return (
    <Card
      variant="outlined"
      sx={{
        position: "relative",
        margin: "10px auto",
      }}
    >
      <CardHeader
        title={task.name}
        titleTypographyProps={{
          variant: "h6",
          lineHeight: "1.5rem",
        }}
        sx={{ pb: 2 }}
      />
      <CardContent sx={{ pt: 0 }}>
        {task.child_ids?.length ? (
          task.child_ids
            .filter((subTask) => (hideCompleted ? subTask.stage_id.id !== STAGE_TO_ID_MAP["done"] : true))
            .map((subTask) => <ProjectSubTask key={subTask.id} task={subTask} />)
        ) : (
          <ProjectSubTask key={task.id} task={task} />
        )}
      </CardContent>
    </Card>
  );
}
