import { format } from "date-fns";

import * as React from "react";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, Tooltip } from "@mui/material";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";

import { toPrettyRange } from "@lib/utils";

import { Timesheet } from "@store/projectTaskStore";

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

export default function TimeEntries({ entries }: { entries: Timesheet[] }) {
  const handleDelete = () => {
    console.info("You clicked the delete icon.");
  };

  const handleUpdateTimeEntry = () => {
    console.info("You clicked the chip.");
  };

  const handleAddTimeEntry = () => {
    console.info("You clicked the chip.");
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
      }}
      component="ul"
    >
      {entries.map((data) => {
        return (
          <Box component="li" key={data.id} m={0.5}>
            <Tooltip title={getTooltipTitle(data)} placement="top" arrow>
              <Chip
                label={getLabel(data.name, data.unit_amount)}
                onDelete={handleDelete}
                onClick={handleUpdateTimeEntry}
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
          onClick={handleAddTimeEntry}
          color="primary"
        />
      </Box>
    </Paper>
  );
}
