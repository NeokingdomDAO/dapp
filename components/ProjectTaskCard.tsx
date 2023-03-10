import { useState } from "react";

import { Delete, Edit, MoreVert } from "@mui/icons-material";
import { Card, CardContent, CardHeader, IconButton, Menu, MenuItem } from "@mui/material";

import useProjectTaskStore, { ProjectTask } from "@store/projectTaskStore";

import { STAGE_TO_ID_MAP } from "../lib/constants";
import ProjectSubTask from "./ProjectSubTask";
import TaskForm from "./TaskForm";

export default function ProjectTaskCard({ task, hideCompleted }: { task: ProjectTask; hideCompleted?: boolean }) {
  const [editTask, setEditTask] = useState<number | null>(null);
  const updateTask = useProjectTaskStore((state) => state.updateTask);
  const deleteTask = useProjectTaskStore((state) => state.deleteTask);

  const [taskMenu, setTaskMenu] = useState<null | HTMLElement>(null);
  const openTaskMenu = Boolean(taskMenu);
  const handleOpenTaskMenu = (event: React.MouseEvent<HTMLElement>) => setTaskMenu(event.currentTarget);
  const handleCloseTaskMenu = () => setTaskMenu(null);

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
          <>
            <IconButton
              aria-label="more"
              aria-expanded={openTaskMenu ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleOpenTaskMenu}
            >
              <MoreVert />
            </IconButton>
            <Menu id="task-menu" anchorEl={taskMenu} open={openTaskMenu} onClose={handleCloseTaskMenu}>
              <MenuItem
                key="edit-task"
                onClick={() => {
                  setEditTask(task.id);
                  handleCloseTaskMenu();
                }}
              >
                <Edit sx={{ mr: 1 }} />
                Edit Task
              </MenuItem>
              <MenuItem
                key="delete-task"
                onClick={() => {
                  deleteTask(task);
                  handleCloseTaskMenu();
                }}
              >
                <Delete sx={{ mr: 1 }} />
                Delete Task
              </MenuItem>
            </Menu>
          </>
        }
        sx={{ pb: 2 }}
      />
      <CardContent sx={{ pt: 0 }}>
        {editTask === task.id ? (
          <TaskForm
            task={task}
            onCancel={() => setEditTask(null)}
            onConfirm={(data) => {
              updateTask({ id: task.id, ...data });
              setEditTask(null);
            }}
          />
        ) : task.child_ids?.length ? (
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
