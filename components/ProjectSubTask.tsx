import { shallow } from "zustand/shallow";

import { Fragment, useMemo, useState } from "react";

import {
  CheckCircleRounded,
  Delete,
  Done,
  ModeEdit,
  MoreTime,
  OpenInNew,
  PlayArrow,
  Settings,
  Stop,
} from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Collapse,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

import { STAGE_TO_ID_MAP } from "@lib/constants";
import { getTaskName, getTaskTotalHours, stageToColor, toPrettyDuration, toPrettyRange } from "@lib/utils";

import useDialogStore from "@store/dialogStore";
import useProjectTaskStore, { ProjectTask, Timesheet } from "@store/projectTaskStore";

import TimeEntryForm from "./TimeEntryForm";

export default function ProjectSubTask({ task }: { task: ProjectTask }) {
  const theme = useTheme();
  const [
    trackedTask,
    startTrackingTask,
    stopTrackingTask,
    markTaskAsDone,
    createTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
  ] = useProjectTaskStore(
    (state) => [
      state.trackedTask,
      state.startTrackingTask,
      state.stopTrackingTask,
      state.markTaskAsDone,
      state.createTimeEntry,
      state.updateTimeEntry,
      state.deleteTimeEntry,
    ],
    shallow,
  );

  const [expanded, setExpanded] = useState<number | false>(false);
  const [updateTimeEntryOpen, setUpdateTimeEntryOpen] = useState<number | boolean>(false);
  const [createTimeEntryOpen, setCreateTimeEntryOpen] = useState<boolean>(false);
  const openDialog = useDialogStore(({ openDialog }) => openDialog);
  const totalHours = useMemo(() => getTaskTotalHours(task), [task]);

  const handleTaskClick = (taskId: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    event.preventDefault();
    setExpanded(isExpanded ? taskId : false);
  };

  const handleStartTask = (event: React.SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (trackedTask) {
      openDialog({
        open: true,
        message: (
          <span>
            You are already tracking <strong>{getTaskName(trackedTask)}</strong>, do you want to switch to{" "}
            <strong> {getTaskName(task)}</strong> instead?
          </span>
        ),
        onConfirm: async () => {
          await stopTrackingTask(trackedTask);
          await startTrackingTask(task);
        },
      });
    } else {
      startTrackingTask(task);
    }
  };

  const handleTrackTime = async () => {
    if (trackedTask) {
      await stopTrackingTask(trackedTask);
    }
    await startTrackingTask(task);
  };

  const handleStopTask = (event: React.SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    stopTrackingTask(task);
  };

  const handleNewTimeEntry = () => {
    setCreateTimeEntryOpen(true);
    setMenuOptions(null);
  };
  const handleEditTimeEntry = (timeEntry: Timesheet) =>
    setUpdateTimeEntryOpen(updateTimeEntryOpen ? false : timeEntry.id);
  const handleDeleteTimeEntry = (timeEntry: Timesheet) => deleteTimeEntry(timeEntry, task);

  const [menuOptions, setMenuOptions] = useState<null | HTMLElement>(null);
  const openMenuOptions = Boolean(menuOptions);
  const handleOptionsClick = (event: React.MouseEvent<HTMLElement>) => setMenuOptions(event.currentTarget);
  const handleOptionsClose = () => setMenuOptions(null);

  const renderTaskAction = () => {
    const isDone = task.stage_id.id === STAGE_TO_ID_MAP["done"];
    if (isDone) {
      return (
        <IconButton sx={{ padding: 0 }} color="success">
          <CheckCircleRounded fontSize="large" />
        </IconButton>
      );
    }
    if (trackedTask && trackedTask.id === task.id) {
      return (
        <IconButton sx={{ padding: 0, border: `1px solid ${theme.palette.primary.main}` }} onClick={handleStopTask}>
          <Stop sx={{ fontSize: 30 }} color="primary" />
        </IconButton>
      );
    }
    return (
      <IconButton sx={{ padding: 0, border: `1px solid ${theme.palette.grey[300]}` }} onClick={handleStartTask}>
        <PlayArrow sx={{ fontSize: 30 }} />
      </IconButton>
    );
  };

  return (
    <Accordion
      sx={{ border: 0 }}
      variant="outlined"
      expanded={expanded === task.id}
      onChange={handleTaskClick(task.id)}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ width: "100%", pr: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", justifyContent: "left", alignItems: "center" }}>
            {renderTaskAction()}
            <Typography id={`task-${task.id}`} sx={{ ml: 1 }}>
              {task.name}
            </Typography>
          </Box>
          <Chip label={task.stage_id.name} color={stageToColor(task.stage_id.name)} variant="outlined" size="small" />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          <strong>Total time:</strong> <span>{totalHours ? toPrettyDuration(totalHours) : "-"}</span>
        </Typography>
        <Box sx={{ mt: 1, mb: 1, display: "flex" }}>
          {task.stage_id.id === STAGE_TO_ID_MAP["done"] ? (
            <Button
              onClick={() => handleTrackTime()}
              sx={{ mr: 1 }}
              variant="outlined"
              startIcon={<PlayArrow />}
              size="small"
            >
              Track Time
            </Button>
          ) : (
            <Button
              onClick={() => markTaskAsDone(task)}
              sx={{ mr: 1 }}
              variant="outlined"
              color="success"
              startIcon={<Done />}
              size="small"
            >
              Mark as Done
            </Button>
          )}

          <Box>
            <Button
              id="options-button"
              size="small"
              variant="outlined"
              aria-controls={openMenuOptions ? "options-menu" : undefined}
              aria-expanded={openMenuOptions ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleOptionsClick}
              sx={{ minWidth: "40px" }}
            >
              <Settings />
            </Button>
            <Menu
              id="options-menu"
              MenuListProps={{ "aria-labelledby": "options-button" }}
              anchorEl={menuOptions}
              open={openMenuOptions}
              onClose={handleOptionsClose}
            >
              <MenuItem onClick={handleOptionsClose}>
                <Link
                  href={`${process.env.NEXT_PUBLIC_ODOO_ENDPOINT}/web#model=project.task&id=${task.id}&view_type=form`}
                  target="_blank"
                  underline="none"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <OpenInNew sx={{ mr: 1 }} />
                  Open in Odoo
                </Link>
              </MenuItem>
              <MenuItem onClick={handleNewTimeEntry}>
                <MoreTime sx={{ mr: 1 }} />
                New Time Entry
              </MenuItem>
            </Menu>
          </Box>
        </Box>
        <TableContainer component={Paper} variant="outlined">
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Duration</TableCell>
                <TableCell sx={{ minWidth: 160 }}>Range</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                  <Collapse in={createTimeEntryOpen} timeout="auto" unmountOnExit>
                    <Box>
                      <TimeEntryForm
                        onCancel={() => setCreateTimeEntryOpen(false)}
                        onConfirm={async (payload) => {
                          const success = await createTimeEntry(payload, task);
                          if (success) {
                            setCreateTimeEntryOpen(false);
                          }
                        }}
                      />
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
              {task.timesheet_ids.map((row) => (
                <Fragment key={row.id}>
                  <TableRow
                    key={row.id}
                    sx={{ "& > td": { borderBottom: "unset" }, "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{toPrettyDuration(row.unit_amount)}</TableCell>
                    <TableCell sx={{ minWidth: 160 }}>
                      {toPrettyRange(row.start, row.end)}
                      {!row.end && (
                        <span>
                          -<strong>now</strong>
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell align="right">
                      <ToggleButtonGroup size="small" exclusive>
                        <ToggleButton value="edit">
                          <Tooltip title="Update" placement="top" onClick={() => handleEditTimeEntry(row)}>
                            <ModeEdit fontSize="small" />
                          </Tooltip>
                        </ToggleButton>
                        <ToggleButton value="delete" onClick={() => handleDeleteTimeEntry(row)}>
                          <Tooltip title="Delete" placement="top">
                            <Delete fontSize="small" />
                          </Tooltip>
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                      <Collapse in={updateTimeEntryOpen === row.id} timeout="auto" unmountOnExit>
                        <Box>
                          <TimeEntryForm
                            timeEntry={row}
                            onCancel={() => setUpdateTimeEntryOpen(false)}
                            onConfirm={(data) => {
                              updateTimeEntry(data, task);
                              setUpdateTimeEntryOpen(false);
                            }}
                          />
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );
}
