import { useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import ListIcon from "@mui/icons-material/List";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Divider, IconButton, Menu, MenuItem, Paper, Stack, Typography } from "@mui/material";

import { Timesheet } from "@store/projectTaskStore";

import ElapsedTime from "@components/time-entry/ElapsedTime";

export default function TaskTimeEntry({ timeEntry }: { timeEntry: Timesheet }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpdateEntry = () => {
    handleClose();
  };

  const handleDeleteEntry = () => {
    handleClose();
  };

  return (
    <Paper sx={{ p: 1 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="caption" sx={{ mr: 2 }}>
          {timeEntry.name}
        </Typography>
        <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1} alignItems="center">
          <ElapsedTime elapsedTime={timeEntry.unit_amount * 3600} hideSeconds withLabels size="small" />
          <IconButton aria-label="start" color="primary" size="small" onClick={handleClick}>
            <ListIcon />
          </IconButton>
        </Stack>
      </Stack>
      <Menu
        id="task-menu"
        aria-labelledby="task-menu-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleUpdateEntry}>Update</MenuItem>
        <MenuItem onClick={handleDeleteEntry}>Delete</MenuItem>
      </Menu>
    </Paper>
  );
}
