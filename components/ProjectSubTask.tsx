import { shallow } from "zustand/shallow";

import { useMemo, useState } from "react";

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
  IconButton,
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

import { getTaskName, toPrettyDuration, toPrettyRange } from "@lib/utils";

import useDialogStore from "@store/dialogStore";
import useProjectTaskStore, { ProjectTask, Timesheet } from "@store/projectTaskStore";

export default function ProjectSubTask({ task }: { task: ProjectTask }) {
  const theme = useTheme();
  const [trackedTask, startTrackingTask, stopTrackingTask, deleteTimeEntry] = useProjectTaskStore(
    (state) => [state.trackedTask, state.startTrackingTask, state.stopTrackingTask, state.deleteTimeEntry],
    shallow,
  );
  const [expanded, setExpanded] = useState<number | false>(false);
  const openDialog = useDialogStore(({ openDialog }) => openDialog);
  const totalTime = useMemo(
    () => task.timesheet_ids.reduce((tot, time) => (tot += time.unit_amount), 0),
    [task.timesheet_ids],
  );

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

  const handleStopTask = (event: React.SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    stopTrackingTask(task);
  };

  const handleDeleteTimeEntry = (timeEntry: Timesheet) => deleteTimeEntry(timeEntry, task);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleOptionsClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleOptionsClose = () => setAnchorEl(null);

  const renderTaskAction = () => {
    const isDone = task.stage_id.name === "Done";
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
    <Accordion variant="outlined" expanded={expanded === task.id} onChange={handleTaskClick(task.id)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: "flex", justifyContent: "left", alignItems: "center" }}>
          {renderTaskAction()}
          <Typography sx={{ ml: 1 }}>{task.name}</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          <strong>Total time: </strong>
          <span>{totalTime ? toPrettyDuration(totalTime) : "-"}</span>
        </Typography>
        <Box sx={{ mt: 1, mb: 1, display: "flex" }}>
          {task.stage_id.name === "Done" ? (
            <Button sx={{ mr: 1 }} variant="outlined" startIcon={<PlayArrow />} size="small">
              Track Time
            </Button>
          ) : (
            <Button sx={{ mr: 1 }} variant="outlined" color="success" startIcon={<Done />} size="small">
              Mark as Done
            </Button>
          )}

          <Box>
            <Button
              id="options-button"
              size="small"
              variant="outlined"
              aria-controls={open ? "options-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleOptionsClick}
              sx={{ minWidth: "40px" }}
            >
              <Settings />
            </Button>
            <Menu
              id="options-menu"
              MenuListProps={{ "aria-labelledby": "options-button" }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleOptionsClose}
            >
              <MenuItem onClick={handleOptionsClose}>
                <OpenInNew sx={{ mr: 1 }} />
                Open in Odoo
              </MenuItem>
              <MenuItem onClick={handleOptionsClose}>
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
              {task.timesheet_ids.map((row) => (
                <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
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
                        <Tooltip title="Edit" placement="top">
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );
}
