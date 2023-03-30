import { format } from "date-fns";

import { useState } from "react";

import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import { Timesheet } from "@store/projectTaskStore";

export default function TimeEntryForm({
  timeEntry,
  onConfirm,
  onCancel,
}: {
  timeEntry?: Timesheet;
  onConfirm: (data: any) => void;
  onCancel?: () => void;
}) {
  const now = new Date();
  const dateFormat = "yyyy-MM-dd HH:mm:ss";
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<{ start: string; end?: string; name: string }>({
    name: "",
    ...(timeEntry || {}),
    start: format(timeEntry?.start ? new Date(timeEntry.start * 1000) : now, dateFormat),
    end: format(timeEntry?.end ? new Date(timeEntry.end * 1000) : now, dateFormat),
  });

  const onSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    const data = { ...(timeEntry || {}), ...form };
    await onConfirm(data);
    setIsLoading(false);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }} component="form" onSubmit={onSubmit} autoComplete="off">
      <Box sx={{ maxWidth: "500px" }}>
        <Box sx={{ display: "flex", justifyContent: "left", mt: 3 }}>
          <DateTimePicker
            label="Start"
            format="yyyy/MM/dd HH:mm"
            ampm={false}
            value={form.start ? new Date(form.start) : null}
            onChange={(datetime: any) => setForm({ ...form, start: format(datetime, dateFormat) })}
          />
          <DateTimePicker
            sx={{ ml: 2 }}
            label="End"
            format="yyyy/MM/dd HH:mm"
            ampm={false}
            value={form.end ? new Date(form.end) : null}
            onChange={(datetime: any) => setForm({ ...form, end: format(datetime, dateFormat) })}
          />
        </Box>
        <Box sx={{ mt: 2, mb: 2 }}>
          <TextField
            sx={{ width: "100%" }}
            id="newEntry-description"
            label="Description"
            placeholder="Insert Description"
            multiline
            required
            rows={4}
            value={form.name}
            onChange={(e: any) => setForm({ ...form, name: e.target.value })}
            variant="outlined"
          />
        </Box>
        <Box sx={{ display: "flex", mb: 2 }}>
          {onCancel && (
            <Button onClick={onCancel} variant="outlined" sx={{ mr: 2, flex: "50%" }}>
              Cancel
            </Button>
          )}

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isLoading}
            sx={{ flex: "50%" }}
            disabled={!form.start || !form.end || !form.name}
          >
            {timeEntry ? "Update" : "Create"}
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  );
}
