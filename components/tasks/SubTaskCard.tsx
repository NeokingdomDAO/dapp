import { useState } from "react";

import { Delete, Done, Edit, MoreTimeOutlined, MoreVert, OpenInNew } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardHeader,
  Divider,
  IconButton,
  Link,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";

import { ProjectTask, useProjectTaskActions } from "@store/projectTaskStore";

import useErrorHandler from "@hooks/useErrorHandler";

import TaskForm from "./TaskForm";
import TimeEntryList from "./TimeEntryList";

export default function SubTaskCard({ task }: { task: ProjectTask }) {
  const theme = useTheme();
  const [newTimeEntry, addNewTimeEntry] = useState<boolean>(false);
  const [subtaskExpanded, setSubtaskExpanded] = useState(false);
  const [editTask, setEditTask] = useState<boolean>(false);
  const [taskMenu, setTaskMenu] = useState<null | HTMLElement>(null);
  const openTaskMenu = Boolean(taskMenu);
  const handleCloseTaskMenu = () => setTaskMenu(null);

  const { handleError } = useErrorHandler();
  const actions = useProjectTaskActions();
  const updateTask = handleError(actions.updateTask);
  const deleteTask = handleError(actions.deleteTask);
  const markTaskAsDone = handleError(actions.markTaskAsDone);

  const cardHeaderActions = () => (
    <>
      <IconButton
        aria-label="more"
        aria-expanded={openTaskMenu ? "true" : undefined}
        aria-haspopup="true"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setTaskMenu(e.currentTarget);
        }}
        sx={{ p: 0 }}
      >
        <MoreVert />
      </IconButton>
      <Menu id="task-menu" anchorEl={taskMenu} open={openTaskMenu} onClose={handleCloseTaskMenu}>
        <MenuItem
          key="edit-task"
          onClick={() => {
            setEditTask(true);
            handleCloseTaskMenu();
          }}
        >
          <Edit sx={{ mr: 1 }} />
          Edit Sub-task
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleCloseTaskMenu}>
          <Link
            href={`${process.env.NEXT_PUBLIC_ODOO_ENDPOINT}/web#model=project.task&id=${task.id}&view_type=form`}
            target="_blank"
            underline="none"
            sx={{ display: "flex", alignItems: "center", color: theme.palette.text.primary }}
          >
            <OpenInNew sx={{ mr: 1 }} />
            Open in Odoo
          </Link>
        </MenuItem>
        <MenuItem
          key="mark-as-done-task"
          onClick={() => {
            markTaskAsDone(task);
            handleCloseTaskMenu();
          }}
        >
          <Done sx={{ mr: 1 }} />
          Mark As Done
        </MenuItem>
        <MenuItem
          key="mark-as-done-task"
          onClick={() => {
            setSubtaskExpanded(true);
            addNewTimeEntry(true);
            handleCloseTaskMenu();
          }}
        >
          <MoreTimeOutlined sx={{ mr: 1 }} />
          New Time Entry
        </MenuItem>
        <Divider />
        <MenuItem
          key="delete-task"
          onClick={() => {
            deleteTask(task);
            handleCloseTaskMenu();
          }}
        >
          <Delete sx={{ color: theme.palette.error.main, mr: 1 }} />
          <Box sx={{ color: theme.palette.error.main }}>Delete Sub-task</Box>
        </MenuItem>
      </Menu>
    </>
  );

  return (
    <Card
      variant="outlined"
      sx={{
        position: "relative",
        p: 1,
        mb: "4px",
      }}
    >
      {editTask ? (
        <TaskForm
          task={task}
          onCancel={() => setEditTask(false)}
          onConfirm={(data) => {
            updateTask({ id: task.id, ...data });
            setEditTask(false);
          }}
        />
      ) : (
        <Accordion sx={{ border: 0 }} variant="outlined" expanded={subtaskExpanded}>
          <AccordionSummary
            sx={{
              p: 0,
              minHeight: 0,
              position: "relative",
              "&.Mui-expanded": { minHeight: 0 },
              "& .MuiAccordionSummary-content": { margin: 0 },
              "& .MuiAccordionSummary-content.Mui-expanded": { margin: 0 },
            }}
          >
            <Box sx={{ pr: "20px" }} onClick={() => setSubtaskExpanded(!subtaskExpanded)}>
              {task.name}
            </Box>
            <Box sx={{ position: "absolute", right: 0, top: 0 }}>{cardHeaderActions()}</Box>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0, pt: "8px" }}>
            <TimeEntryList task={task} showNewTimeEntry={newTimeEntry} />
          </AccordionDetails>
        </Accordion>
      )}
    </Card>
  );
}
