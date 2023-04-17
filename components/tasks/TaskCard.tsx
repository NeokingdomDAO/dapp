import { ReactElement, ReactEventHandler, useState } from "react";

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
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";

import { stageToColor, toPrettyDuration } from "@lib/utils";

import { ProjectTask, useProjectTaskActions } from "@store/projectTaskStore";

import useErrorHandler from "@hooks/useErrorHandler";

import Stopwatch from "./Stopwatch";
import SubTaskCard from "./SubTaskCard";
import TaskForm from "./TaskForm";
import TimeEntry from "./TimeEntry";
import TimeEntryForm from "./TimeEntryForm";

export default function TaskCard({ task }: { task: ProjectTask }) {
  const theme = useTheme();
  const [stopwatchExpanded, setStopwatchExpanded] = useState<boolean>(false);
  const [subtasksExpanded, setSubtasksExpanded] = useState<boolean>(false);
  const [newTimeEntry, addNewTimeEntry] = useState<boolean>(false);

  const { handleError } = useErrorHandler();
  const actions = useProjectTaskActions();
  const updateTask = handleError(actions.updateTask);
  const deleteTask = handleError(actions.deleteTask);
  const markTaskAsDone = handleError(actions.markTaskAsDone);
  const createTimeEntry = handleError(actions.createTimeEntry);

  const [editTask, setEditTask] = useState<number | null>(null);
  const [taskMenu, setTaskMenu] = useState<null | HTMLElement>(null);
  const openTaskMenu = Boolean(taskMenu);
  const handleOpenTaskMenu = (event: React.MouseEvent<HTMLElement>) => setTaskMenu(event.currentTarget);
  const handleCloseTaskMenu = () => setTaskMenu(null);

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
          key="mark-as-done-task"
          onClick={() => {
            setStopwatchExpanded(true);
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
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography>
                  <strong>Total time:</strong>
                  <span>{toPrettyDuration(task.effective_hours)}</span>
                </Typography>
                <CardBtn onClick={() => addNewTimeEntry(!newTimeEntry)}>
                  <MoreTimeOutlined sx={{ fontSize: "1rem", mr: "3px" }} />
                  <span>New Time Entry</span>
                </CardBtn>
              </Box>
              <Grid container sx={{ m: 0, width: "100%" }} spacing={0}>
                {newTimeEntry && (
                  <Grid item sx={{ pl: 0, pt: 0, p: 0 }} xs={12} sm={4}>
                    <Box
                      sx={{
                        m: "5px",
                        ml: 0,
                        p: "5px",
                        borderRadius: "3px",
                        border: `1px solid ${theme.palette.divider}`,
                        position: "relative",
                      }}
                    >
                      <TimeEntryForm
                        onConfirm={(data) => {
                          createTimeEntry(data, task);
                          addNewTimeEntry(false);
                        }}
                        onCancel={() => addNewTimeEntry(false)}
                      />
                    </Box>
                  </Grid>
                )}
                {task.timesheet_ids.map((row) => (
                  <Grid item sx={{ pl: 0, pt: 0, p: 0 }} xs={12} sm={4} key={row.id}>
                    <TimeEntry task={task} timeEntry={row} />
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Box sx={{ mt: 2 }}>
            {!task.child_ids.length ? (
              <CardBtn onClick={() => setSubtasksExpanded(!subtasksExpanded)}>
                <Add sx={{ fontSize: "1rem" }} />
                <span>Add Sub-task</span>
              </CardBtn>
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
                  <CardBtn onClick={() => setSubtasksExpanded(!subtasksExpanded)}>
                    {subtasksExpanded ? (
                      <KeyboardArrowDown sx={{ fontSize: "1rem" }} />
                    ) : (
                      <KeyboardArrowRight sx={{ fontSize: "1rem" }} />
                    )}
                    <span>Sub-tasks</span>
                    <Box sx={{ ml: ".25rem", fontWeight: "500" }}>{task.child_ids.length}</Box>
                  </CardBtn>
                  {subtasksExpanded ? (
                    <CardBtn>
                      <Add sx={{ fontSize: "1rem" }} />
                      <span>Create New</span>
                    </CardBtn>
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

function CardBtn({ onClick, children }: { onClick?: ReactEventHandler; children: ReactElement[] }) {
  const theme = useTheme();
  return (
    <Box
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick && onClick(e);
      }}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "3px",
        p: "3px 4px",
        pr: "8px",
        m: 0,
        fontSize: "0.9rem",
        "&:hover": {
          background: theme.palette.action.hover,
          cursor: "pointer",
        },
      }}
    >
      {...children}
    </Box>
  );
}
