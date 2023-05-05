import { useState } from "react";

import {
  AccessTimeOutlined,
  CalendarMonthOutlined,
  Delete,
  Edit,
  ModeEditOutlined,
  MoreVert,
} from "@mui/icons-material";
import { Box, IconButton, Menu, MenuItem, Typography, useTheme } from "@mui/material";

import { toPrettyDuration, toPrettyRange } from "@lib/utils";

import { ProjectTask, Timesheet, useProjectTaskActions } from "@store/projectTaskStore";

import useErrorHandler from "@hooks/useErrorHandler";

import TimeEntryForm from "./TimeEntryForm";

export default function TimeEntry({ task, timeEntry }: { task: ProjectTask; timeEntry: Timesheet }) {
  const theme = useTheme();
  const [isEditMode, setEditMode] = useState(false);
  const [taskMenu, setTaskMenu] = useState<null | HTMLElement>(null);
  const openTaskMenu = Boolean(taskMenu);
  const handleOpenTaskMenu = (event: React.MouseEvent<HTMLElement>) => setTaskMenu(event.currentTarget);
  const handleCloseTaskMenu = () => setTaskMenu(null);

  const { handleError } = useErrorHandler();
  const actions = useProjectTaskActions();
  const deleteTimeEntry = handleError(actions.deleteTimeEntry);
  const updateTimeEntry = handleError(actions.updateTimeEntry);

  const renderMenu = () => (
    <>
      <IconButton
        aria-label="more"
        aria-expanded={openTaskMenu ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleOpenTaskMenu}
        sx={{ position: "absolute", p: "2px", right: 0, top: 0 }}
      >
        <MoreVert fontSize="small" />
      </IconButton>
      <Menu id="time-entry-menu" anchorEl={taskMenu} open={openTaskMenu} onClose={handleCloseTaskMenu}>
        <MenuItem
          key="edit-time-entry"
          onClick={() => {
            setEditMode(true);
            handleCloseTaskMenu();
          }}
        >
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem
          key="delete-time-entry"
          onClick={() => {
            deleteTimeEntry(timeEntry, task);
            handleCloseTaskMenu();
          }}
        >
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </>
  );

  return (
    <Box
      sx={{
        m: "5px",
        p: 1,
        borderRadius: "3px",
        border: `1px solid ${theme.palette.divider}`,
        position: "relative",
        height: "calc(100% - 10px)",
      }}
    >
      {isEditMode ? (
        <TimeEntryForm
          timeEntry={timeEntry}
          onConfirm={(data) => {
            updateTimeEntry(data);
            setEditMode(false);
          }}
          onCancel={() => setEditMode(false)}
        />
      ) : (
        <Box>
          <Box sx={{ m: 1, display: "flex", pr: "24px", position: "relative" }}>
            <Box>
              <Typography variant="subtitle2" component="h6">
                {toPrettyRange(timeEntry.start, timeEntry.end)}
                {!timeEntry.end && (
                  <span>
                    -<strong>now</strong>
                  </span>
                )}{" "}
                ({toPrettyDuration(timeEntry.unit_amount)})
              </Typography>
            </Box>
            {renderMenu()}
          </Box>
          <Box sx={{ p: 1, pt: 0 }}>
            <Typography variant="body2" component="h6">
              {timeEntry.name}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
