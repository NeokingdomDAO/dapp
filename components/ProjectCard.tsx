import { useMemo, useState } from "react";

import { Add, Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, Card, CardContent, CardHeader, Link, Stack, Typography } from "@mui/material";

import { Project } from "@store/projectTaskStore";

import ProjectTaskCard from "./ProjectTaskCard";

export default function ProjectCard({ project }: { project: Project }) {
  const [showCompleted, setShowCompleted] = useState(true);
  const tasks = useMemo(
    () => project.tasks.filter((task) => !task.parent_id && !["Approved", "Done"].includes(task.stage_id.name)),
    [project],
  );
  const completedTasks = useMemo(
    () => project.tasks.filter((task) => !task.parent_id && task.stage_id.name === "Done"),
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
            startIcon={showCompleted ? <VisibilityOff /> : <Visibility />}
            onClick={() => setShowCompleted(!showCompleted)}
          >
            {showCompleted ? "Hide" : "Show"} Completed ({completedTasks.length})
          </Button>
        )}
        <Button sx={{ ml: 1 }} variant="outlined" color="success" startIcon={<Add />} size="small">
          New Task
        </Button>
      </Box>
      <CardContent sx={{ pt: 0, pb: 0 }}>
        {showCompleted && completedTasks.map((task) => <ProjectTaskCard key={task.id} task={task} />)}
        {tasks.map((task) => (
          <ProjectTaskCard key={task.id} task={task} />
        ))}
      </CardContent>
    </Card>
  );
}
