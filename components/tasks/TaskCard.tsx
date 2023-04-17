import { useState } from "react";

import {
  Add,
  Delete,
  Done,
  Edit,
  KeyboardArrowDown,
  KeyboardArrowRight,
  MoreTimeOutlined,
  MoreVert,
  OpenInNew,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  IconButton,
  Link,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";

import { stageToColor } from "@lib/utils";

import { ProjectTask, useProjectTaskActions } from "@store/projectTaskStore";

import useErrorHandler from "@hooks/useErrorHandler";

import useDialogStore from "../../store/dialogStore";
import ActionCardBtn from "./ActionBtn";
import Stopwatch from "./Stopwatch";
import SubTaskCard from "./SubTaskCard";
import TaskForm from "./TaskForm";
import TimeEntryList from "./TimeEntryList";

export default function TaskCard({ task }: { task: ProjectTask }) {
  const theme = useTheme();
  const [stopwatchExpanded, setStopwatchExpanded] = useState<boolean>(false);
  const [subtasksExpanded, setSubtasksExpanded] = useState<boolean>(false);
  const [newTimeEntry, addNewTimeEntry] = useState<boolean>(false);

  const { handleError } = useErrorHandler();
  const actions = useProjectTaskActions();
  const createTask = handleError(actions.createTask);
  const updateTask = handleError(actions.updateTask);
  const deleteTask = handleError(actions.deleteTask);
  const markTaskAsDone = handleError(actions.markTaskAsDone);

  const [editTask, setEditTask] = useState<number | null>(null);
  const [taskMenu, setTaskMenu] = useState<null | HTMLElement>(null);
  const openTaskMenu = Boolean(taskMenu);
  const handleOpenTaskMenu = (event: React.MouseEvent<HTMLElement>) => setTaskMenu(event.currentTarget);
  const handleCloseTaskMenu = () => setTaskMenu(null);
  const openDialog = useDialogStore(({ openDialog }) => openDialog);
  const closeDialog = useDialogStore(({ closeDialog }) => closeDialog);

  const createNewSubTask = () => {
    openDialog({
      open: true,
      title: (
        <Box sx={{ display: "flex" }}>
          <Box sx={{ fontWeight: "200" }}>New sub-task for</Box>
          <Box sx={{ ml: "4px" }}>{task.name}</Box>
        </Box>
      ),
      message: (
        <TaskForm
          parentTask={task}
          onCancel={() => closeDialog()}
          onConfirm={(data) => {
            createTask({ ...data, parent_id: task.id });
            closeDialog();
          }}
        />
      ),
    });
  };

  const cardHeaderActions = () => (
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
          key="new-time-entry"
          onClick={() => {
            setStopwatchExpanded(true);
            addNewTimeEntry(true);
            handleCloseTaskMenu();
          }}
        >
          <MoreTimeOutlined sx={{ mr: 1 }} />
          New Time Entry
        </MenuItem>
        <MenuItem
          key="new-sub-task"
          onClick={() => {
            createNewSubTask();
            handleCloseTaskMenu();
          }}
        >
          <Add sx={{ mr: 1 }} />
          New Sub-task
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
          <Box sx={{ color: theme.palette.error.main }}>Delete Task</Box>
        </MenuItem>
      </Menu>
    </>
  );

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
        action={cardHeaderActions()}
      />
      {editTask === task.id ? (
        <CardContent sx={{ pt: 0 }}>
          <TaskForm
            task={task}
            onCancel={() => setEditTask(null)}
            onConfirm={(data) => {
              updateTask({ id: task.id, ...data });
              setEditTask(null);
            }}
          />
        </CardContent>
      ) : (
        <CardContent sx={{ pt: 0, "&:last-child": { pb: 2 } }}>
          <Accordion
            sx={{ border: 0 }}
            variant="outlined"
            expanded={stopwatchExpanded}
            onChange={() => setStopwatchExpanded(!stopwatchExpanded)}
          >
            <AccordionSummary
              sx={{
                p: 0,
                minHeight: 0,
                "&.Mui-expanded": { minHeight: 0 },
                "& .MuiAccordionSummary-content": { margin: 0 },
                "& .MuiAccordionSummary-content.Mui-expanded": { margin: 0 },
              }}
            >
              <Stopwatch task={task} />
              <Chip
                sx={{ ml: "30px" }}
                label={task.stage_id.name}
                color={stageToColor(task.stage_id.name)}
                variant="outlined"
                size="small"
              />
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0, pt: "8px" }}>
              <TimeEntryList task={task} showNewTimeEntry={newTimeEntry} />
            </AccordionDetails>
          </Accordion>

          <Box sx={{ mt: 2 }}>
            {!task.child_ids.length ? (
              <ActionCardBtn onClick={() => setSubtasksExpanded(!subtasksExpanded)}>
                <Add sx={{ fontSize: "1rem" }} />
                <span>Add Sub-task</span>
              </ActionCardBtn>
            ) : (
              <Accordion sx={{ border: 0 }} variant="outlined" expanded={subtasksExpanded}>
                <AccordionSummary
                  sx={{
                    p: 0,
                    width: "100%",
                    minHeight: 0,
                    display: "flex",
                    "&.Mui-expanded": { minHeight: 0 },
                    "& .MuiAccordionSummary-content": { margin: 0, justifyContent: "space-between" },
                    "& .MuiAccordionSummary-content.Mui-expanded": { margin: 0 },
                  }}
                >
                  <ActionCardBtn onClick={() => setSubtasksExpanded(!subtasksExpanded)}>
                    {subtasksExpanded ? (
                      <KeyboardArrowDown sx={{ fontSize: "1rem" }} />
                    ) : (
                      <KeyboardArrowRight sx={{ fontSize: "1rem" }} />
                    )}
                    <span>Sub-tasks</span>
                    <Box sx={{ ml: ".25rem", fontWeight: "500" }}>{task.child_ids.length}</Box>
                  </ActionCardBtn>
                  {subtasksExpanded ? (
                    <ActionCardBtn onClick={() => createNewSubTask()}>
                      <Add sx={{ fontSize: "1rem" }} />
                      <span>Create New</span>
                    </ActionCardBtn>
                  ) : null}
                </AccordionSummary>
                <AccordionDetails sx={{ padding: 0, pt: "8px" }}>
                  {task.child_ids.map((subtask) => (
                    <SubTaskCard key={subtask.id} task={subtask} />
                  ))}
                </AccordionDetails>
              </Accordion>
            )}
          </Box>
        </CardContent>
      )}
    </Card>
  );
}
