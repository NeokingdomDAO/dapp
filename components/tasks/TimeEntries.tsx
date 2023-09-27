import { format } from "date-fns";

import * as React from "react";

import AddIcon from "@mui/icons-material/Add";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { Box, Button, Stack, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";

import { hexToRgba } from "@lib/utils";

import useProjectTaskStore, { Timesheet } from "@store/projectTaskStore";

import Dialog from "@components/Dialog";
import Modal from "@components/Modal";
import ElapsedTime from "@components/time-entry/ElapsedTime";
import TimeEntryFormStatic from "@components/time-entry/FormStatic";

const toElapsedTime = (num: number) => Number((Math.round(num * 100) / 100).toFixed(2)) * 3600;

export default function TimeEntries({
  entries,
  onAddNew,
  onDelete,
  taskId,
  showNewEntryButton,
  readOnly = false,
  otherCta = null,
}: {
  entries: Timesheet[];
  onAddNew?: () => void;
  onDelete?: (timeEntry: Timesheet) => void;
  taskId: number;
  showNewEntryButton: boolean;
  readOnly?: boolean;
  otherCta?: React.ReactNode;
}) {
  const { loadingTimeEntry } = useProjectTaskStore((state) => ({
    loadingTimeEntry: state.loadingTimeEntry,
  }));
  const [deletingEntry, setDeletingEntry] = React.useState<null | Timesheet>(null);
  const [editingTimeSheet, setEditingTimeSheet] = React.useState<null | Timesheet>(null);

  const handleUpdateTimeEntry = (ts: Timesheet) => {
    setEditingTimeSheet(ts);
  };

  const handleDeleteTimeEntry = () => {
    if (typeof onDelete === "function") {
      onDelete(deletingEntry as Timesheet);
    }
    setDeletingEntry(null);
  };

  const handleDeleteFromUpdate = () => {
    setDeletingEntry(editingTimeSheet as Timesheet);
    setEditingTimeSheet(null);
  };

  const groupedPerDayEntries = React.useMemo(() => {
    const grouped = entries.reduce((acc, curr) => {
      const date = new Date(curr.start * 1000);
      date.setHours(0, 0, 0, 0);
      const timestamp = date.getTime();
      if (!acc[timestamp]) {
        acc[timestamp] = [];
      }
      acc[timestamp].push(curr);
      return acc;
    }, {} as Record<number, Timesheet[]>);

    return Object.keys(grouped)
      .sort()
      .reverse()
      .reduce((obj, key) => {
        const date = new Date(Number(key));
        obj[format(date, "E, dd LLL y")] = {
          timeEntries: grouped[Number(key)],
          dayTime: grouped[Number(key)].reduce((acc, curr) => acc + curr.unit_amount, 0),
        };
        return obj;
      }, {} as Record<string, { timeEntries: Timesheet[]; dayTime: number }>);
  }, [entries]);

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
        ...(entries.length > 2 && {
          "&:after": {
            height: "60px",
            content: `""`,
            position: "absolute",
            zIndex: 1,
            bottom: 0,
            width: "100%",
            left: 0,
            pointerEvents: "none",
            backgroundImage: (t) => `linear-gradient(to top, ${hexToRgba(t.palette.background.paper, 1)}, transparent)`,
          },
        }),
      }}
    >
      {showNewEntryButton && (
        <Box component="li" m={0.5} sx={{ flex: 1 }}>
          <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={onAddNew}>
            New time entry
          </Button>
          {otherCta}
        </Box>
      )}
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
              timeEntryId: editingTimeSheet.id,
            }}
            onDeleteTimeEntry={handleDeleteFromUpdate}
            taskId={taskId}
          />
        </Modal>
      )}
      <Dialog
        open={!!deletingEntry}
        handleClose={() => setDeletingEntry(null)}
        handleApprove={handleDeleteTimeEntry}
        descriptionId="dialog-delete-time-entry"
        title="Delete Time Entry"
      >
        <Typography variant="body1">Are you sure you want to delete this time entry?</Typography>
      </Dialog>
      <Box
        component="ul"
        sx={{
          maxHeight: 300,
          overflow: "auto",
          listStyle: "none",
          m: 0,
          p: 0,
          pb: entries.length > 2 ? "22px" : 0,
          width: "100%",
        }}
      >
        {Object.entries(groupedPerDayEntries).map(([day, entriesObject]) => (
          <Box
            component="li"
            key={day}
            m={0.5}
            sx={{
              "&:hover svg": {
                fill: (t) => t.palette.primary.main,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                position: "sticky",
                zIndex: 1,
                top: 0,
                backgroundImage: (t) =>
                  `linear-gradient(to bottom, ${hexToRgba(t.palette.background.paper, 1)}, ${hexToRgba(
                    t.palette.background.paper,
                    0.6,
                  )})`,
                backdropFilter: "blur(4px)",
                p: 1,
                pl: 0.7,
                "& svg": {
                  fill: (t) => t.palette.grey[500],
                },
              }}
            >
              <DateRangeIcon />
              <Typography variant="body1" sx={{ ml: 1 }}>
                {day}
                {" - "}
                <ElapsedTime
                  minified
                  elapsedTime={toElapsedTime(entriesObject.dayTime)}
                  hideSeconds
                  withLabels
                  size="small"
                />
              </Typography>
            </Box>
            <Box
              component="ul"
              sx={{
                listStyle: "none",
                m: 0,
                p: 0,
                pl: 2,
                ml: 2,
                borderLeft: "1px solid",
                borderColor: "divider",
              }}
            >
              {entriesObject.timeEntries.map((timeEntry) => (
                <Box
                  component="li"
                  key={timeEntry.id}
                  m={0.5}
                  sx={{
                    position: "relative",
                    "&:before": {
                      content: `""`,
                      position: "absolute",
                      width: 10,
                      left: "-19px",
                      height: "2px",
                      top: "13px",
                      bgcolor: "divider",
                    },
                    "&:hover:before": {
                      bgcolor: "primary.main",
                    },
                    ...([loadingTimeEntry, deletingEntry?.id].includes(timeEntry.id)
                      ? { opacity: 0.3, pointerEvents: "none" }
                      : {}),
                  }}
                >
                  <Stack direction="row" justifyContent="space-between">
                    <Box sx={{ wordWrap: "break-word", width: "calc(100% - 140px)" }}>
                      <Typography variant="caption">
                        <b style={{ marginRight: "4px" }}>
                          {format(timeEntry.start * 1000, "H:mm")} - {format((timeEntry.end as number) * 1000, "H:mm")}
                        </b>{" "}
                        {timeEntry.name.trim().length <= 2 ? (
                          <Box sx={{ opacity: 0.6 }} component="span">
                            No description
                          </Box>
                        ) : (
                          timeEntry.name
                        )}
                      </Typography>
                    </Box>
                    {!readOnly && (
                      <Box sx={{ mr: 1, whiteSpace: "nowrap" }}>
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => handleUpdateTimeEntry(timeEntry)}
                          disabled={[loadingTimeEntry, deletingEntry?.id].includes(timeEntry.id)}
                        >
                          edit
                        </Button>
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => setDeletingEntry(timeEntry)}
                          disabled={[loadingTimeEntry, deletingEntry?.id].includes(timeEntry.id)}
                        >
                          delete
                        </Button>
                      </Box>
                    )}
                  </Stack>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
