import { Card, CardContent, CardHeader, Chip } from "@mui/material";

import { ProjectTask } from "@store/projectTaskStore";

import ProjectSubTask from "./ProjectSubTask";

const stageToColor = (stage: string): any => {
  if (!stage) return "default";
  const stageName = stage.toLowerCase().split(" ").join("");
  const stageToColorMap: { [key: string]: string } = {
    created: "default",
    inprogress: "primary",
    done: "success",
    approved: "warning",
  };
  return stageToColorMap[stageName] || "default";
};

export default function ProjectTaskCard({ task }: { task: ProjectTask }) {
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
        action={
          <Chip label={task.stage_id.name} color={stageToColor(task.stage_id.name)} variant="outlined" size="small" />
        }
        sx={{ pb: 2 }}
      />
      <CardContent sx={{ pt: 0 }}>
        {task.child_ids.length ? (
          task.child_ids.map((subTask) => <ProjectSubTask key={subTask.id} task={subTask} />)
        ) : (
          <ProjectSubTask key={task.id} task={task} />
        )}
      </CardContent>
    </Card>
  );
}
