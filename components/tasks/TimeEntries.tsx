import * as React from "react";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, CircularProgress, Tooltip, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";

import { toPrettyRange } from "@lib/utils";

import { Timesheet } from "@store/projectTaskStore";

import Dialog from "@components/Dialog";
import ElapsedTime from "@components/time-entry/ElapsedTime";

const TRUNCATE_AT = 20;

const getLabel = (str: string, time: number) => {
  const label = str.length > TRUNCATE_AT ? str.substring(0, TRUNCATE_AT - 1) + "..." : str;

  return (
    <>
      <span>{label}</span>&nbsp;
      <ElapsedTime minified elapsedTime={time * 3600} hideSeconds withLabels size="small" />
    </>
  );
};

const getTooltipTitle = (timeEntry: Timesheet) => {
  return (
    <>
      <b>{toPrettyRange(timeEntry.start, timeEntry.end)}</b>
      <br />
      <span>{timeEntry.name}</span>
    </>
  );
};

export default function TimeEntries({
  entries,
  onAddNew,
  onDelete,
}: {
  entries: Timesheet[];
  onAddNew: () => void;
  onDelete: (timeEntryId: number) => void;
}) {
  const [deletingId, setDeletingId] = React.useState<null | number>(null);
  const handleUpdateTimeEntry = () => {
    console.info("You clicked the chip.");
  };

  const handleDeleteTimeEntry = () => {
    onDelete(deletingId as number);
    setDeletingId(null);
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
      component="ul"
    >
      <Dialog
        open={!!deletingId}
        handleClose={() => setDeletingId(null)}
        handleApprove={handleDeleteTimeEntry}
        descriptionId="dialog-delete-time-entry"
      >
        <Typography variant="body1">Are you sure you want to delete this time entry?</Typography>
      </Dialog>
      {entries.map((data) => {
        const extraProps = data.id === deletingId ? { disabled: true, deleteIcon: <CircularProgress size={16} /> } : {};
        return (
          <Box component="li" key={data.id} m={0.5}>
            <Tooltip title={getTooltipTitle(data)} placement="top" arrow>
              <Chip
                label={getLabel(data.name, data.unit_amount)}
                onDelete={() => setDeletingId(data.id)}
                onClick={handleUpdateTimeEntry}
                {...extraProps}
              />
            </Tooltip>
          </Box>
        );
      })}
      <Box component="li" m={0.5}>
        <Chip
          variant="outlined"
          label="new time entry"
          icon={<AddCircleOutlineIcon />}
          onClick={onAddNew}
          color="primary"
        />
      </Box>
    </Paper>
  );
}
