import * as React from "react";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, CircularProgress, Tooltip, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";

import { toPrettyRange } from "@lib/utils";

import { Timesheet } from "@store/projectTaskStore";

import Dialog from "@components/Dialog";
import Modal from "@components/Modal";
import ElapsedTime from "@components/time-entry/ElapsedTime";
import TimeEntryFormStatic from "@components/time-entry/FormStatic";

const getLabel = (label: string, time: number) => (
  <Box sx={{ display: "flex", alignItems: "center" }}>
    <Box
      sx={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        maxWidth: "150px",
        display: "inline-block",
      }}
      component="span"
    >
      {label}
    </Box>
    &nbsp;
    <ElapsedTime minified elapsedTime={time * 3600} hideSeconds withLabels size="small" />
  </Box>
);

const getTooltipTitle = (timeEntry: Timesheet) => (
  <>
    <b>{toPrettyRange(timeEntry.start, timeEntry.end)}</b>
    <br />
    <span>{timeEntry.name}</span>
  </>
);

export default function TimeEntries({
  entries,
  onAddNew,
  onDelete,
  taskId,
}: {
  entries: Timesheet[];
  onAddNew: () => void;
  onDelete: (timeEntryId: number) => void;
  taskId: number;
}) {
  const [deletingId, setDeletingId] = React.useState<null | number>(null);
  const [editingTimeSheet, setEditingTimeSheet] = React.useState<null | Timesheet>(null);

  const handleUpdateTimeEntry = (ts: Timesheet) => {
    setEditingTimeSheet(ts);
  };

  const handleDeleteTimeEntry = () => {
    onDelete(deletingId as number);
    setDeletingId(null);
  };

  const handleDeleteFromUpdate = () => {
    setDeletingId(editingTimeSheet?.id as number);
    setEditingTimeSheet(null);
  };

  return (
    <Paper
      sx={{
        display: "flex",
        flexWrap: "wrap",
        listStyle: "none",
        p: 0.5,
        m: 0,
        mt: 1,
        mb: 1,
        position: "relative",
        backgroundImage: "none",
        "&:before": {
          // triangle
          content: '""',
          position: "absolute",
          width: 0,
          height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderBottom: "8px solid",
          borderBottomColor: "background.paper",
          top: -8,
          left: 68,
        },
      }}
    >
      {!!editingTimeSheet && (
        <Modal
          open
          sx={{ bgcolor: (t) => (t.palette.mode === "dark" ? "#1A1A1A" : "#FAFAFA") }}
          onClose={() => setEditingTimeSheet(null)}
        >
          <TimeEntryFormStatic
            onSaved={() => setEditingTimeSheet(null)}
            savedFormData={{
              startTime: new Date(editingTimeSheet.start * 1000),
              endTime: new Date((editingTimeSheet.end as number) * 1000),
              description: editingTimeSheet.name,
            }}
            onDeleteTimeEntry={handleDeleteFromUpdate}
            taskId={taskId}
          />
        </Modal>
      )}
      <Dialog
        open={!!deletingId}
        handleClose={() => setDeletingId(null)}
        handleApprove={handleDeleteTimeEntry}
        descriptionId="dialog-delete-time-entry"
        title="Delete Time Entry"
      >
        <Typography variant="body1">Are you sure you want to delete this time entry?</Typography>
      </Dialog>
      <Box
        component="ul"
        sx={{
          maxHeight: 200,
          overflow: "auto",
          listStyle: "none",
          m: 0,
          p: 0,
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {entries.map((data) => {
          const extraProps =
            data.id === deletingId ? { disabled: true, deleteIcon: <CircularProgress size={16} /> } : {};
          return (
            <Box component="li" key={data.id} m={0.5} sx={{ flex: 1 }}>
              <Tooltip title={getTooltipTitle(data)} placement="top" arrow>
                <Chip
                  label={getLabel(data.name, data.unit_amount)}
                  onDelete={() => setDeletingId(data.id)}
                  onClick={() => handleUpdateTimeEntry(data)}
                  sx={{ width: "100%" }}
                  {...extraProps}
                />
              </Tooltip>
            </Box>
          );
        })}
        <Box component="li" m={0.5} sx={{ flex: 1 }}>
          <Chip
            variant="outlined"
            label="new time entry"
            icon={<AddCircleOutlineIcon />}
            onClick={onAddNew}
            sx={{ width: "100%", maxWidth: "180px" }}
            color="primary"
          />
        </Box>
      </Box>
    </Paper>
  );
}
