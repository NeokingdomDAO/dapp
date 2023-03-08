import { useMemo, useState } from "react";

import { Add, Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, Card, CardContent, CardHeader, Link, Stack, Typography } from "@mui/material";

import { STAGE_TO_ID_MAP } from "@lib/constants";

import { Project } from "@store/projectTaskStore";

import ProjectTaskCard from "./ProjectTaskCard";

export default function ProjectCard({ project }: { project: Project }) {
  const [hideCompleted, setHideCompleted] = useState(true);
  const tasks = useMemo(
    () =>
      project.tasks.filter(
        (task) => !task.parent_id && ![STAGE_TO_ID_MAP["approved"], STAGE_TO_ID_MAP["done"]].includes(task.stage_id.id),
      ),
    [project],
  );
  const completedTasks = useMemo(
    () => project.tasks.filter((task) => !task.parent_id && task.stage_id.id === STAGE_TO_ID_MAP["done"]),
    [project],
  );

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        position: "relative",
        pb: 8,
      }}
    >
      <CardHeader title={project.name} sx={{ pb: 0 }} />
      <Box sx={{ padding: "0 16px", mt: 1, display: "flex", justifyContent: "right" }}>
        {Boolean(completedTasks.length) && (
          <Button
            variant="outlined"
            size="small"
            startIcon={hideCompleted ? <Visibility /> : <VisibilityOff />}
            onClick={() => setHideCompleted(!hideCompleted)}
          >
            {hideCompleted ? "Show" : "Hide"} Completed ({completedTasks.length})
          </Button>
        )}
        <Button sx={{ ml: 1 }} variant="outlined" color="success" startIcon={<Add />} size="small">
          New Task
        </Button>
      </Box>
      <CardContent sx={{ pt: 0, pb: 0 }}>
        {!hideCompleted && completedTasks.map((task) => <ProjectTaskCard key={task.id} task={task} />)}
        {tasks.map((task) => (
          <ProjectTaskCard hideCompleted={hideCompleted} key={task.id} task={task} />
        ))}
      </CardContent>
    </Card>
  );
}
