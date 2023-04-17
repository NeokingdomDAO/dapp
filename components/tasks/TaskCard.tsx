import { useState } from "react";

import { Delete, Done, Edit, MoreTimeOutlined, MoreVert, OpenInNew } from "@mui/icons-material";
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
import TaskForm from "./TaskForm";
import TimeEntry from "./TimeEntry";
import TimeEntryForm from "./TimeEntryForm";

export default function TaskCard({ task }: { task: ProjectTask }) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<number | false>(false);
  const [newTimeEntry, addNewTimeEntry] = useState<boolean>(false);

  const onStopwatchClick = (taskId: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    event.preventDefault();
    setExpanded(isExpanded ? taskId : false);
  };

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
                  setExpanded(task.id);
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
        }
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
        <CardContent sx={{ pt: 0 }}>
          <Accordion
            sx={{ border: 0 }}
            variant="outlined"
            expanded={expanded === task.id}
            onChange={onStopwatchClick(task.id)}
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
                <Button
                  variant="outlined"
                  startIcon={<MoreTimeOutlined />}
                  size="small"
                  onClick={() => addNewTimeEntry(!newTimeEntry)}
                  sx={{ display: { xs: "none", sm: "inline-flex" } }}
                >
                  New Time Entry
                </Button>
                <IconButton
                  color="primary"
                  sx={{ display: { xs: "block", sm: "none" } }}
                  onClick={() => addNewTimeEntry(!newTimeEntry)}
                >
                  <MoreTimeOutlined />
                </IconButton>
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
        </CardContent>
      )}
    </Card>
  );
}
