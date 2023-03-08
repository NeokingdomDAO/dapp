import { format } from "date-fns";

import { useState } from "react";

import { Box, Button, FormControl, FormLabel } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import { Timesheet } from "@store/projectTaskStore";

import TextArea from "./TextArea";

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

  const [form, setForm] = useState<{ start: string; end?: string; name: string }>({
    start: timeEntry ? timeEntry.start : format(now, dateFormat),
    end: timeEntry ? timeEntry.end : format(now, dateFormat),
    name: timeEntry ? timeEntry.name : "",
  });

  const onSubmit = async (event: any) => {
    event.preventDefault();
    const data = { ...(timeEntry || {}), ...form };
    onConfirm(data);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }} component="form" onSubmit={onSubmit} autoComplete="off">
      <Box sx={{ maxWidth: "500px" }}>
        <Box sx={{ display: "flex", justifyContent: "left", mt: 3 }}>
          <DateTimePicker
            required
            label="Start"
            format="yyyy/MM/dd HH:mm"
            ampm={false}
            value={form.start ? new Date(form.start) : null}
            onChange={(datetime: Date) => setForm({ ...form, start: format(datetime, dateFormat) })}
          />
          <DateTimePicker
            sx={{ ml: 2 }}
            required
            label="End"
            format="yyyy/MM/dd HH:mm"
            ampm={false}
            value={form.end ? new Date(form.end) : null}
            onChange={(datetime: Date) => setForm({ ...form, end: format(datetime, dateFormat) })}
          />
        </Box>
        <Box sx={{ mt: 2, mb: 2 }}>
          <FormControl sx={{ width: "100%" }}>
            <FormLabel>Description</FormLabel>
            <TextArea
              required
              aria-label="newEntry-description"
              label="Description"
              minRows={3}
              onChange={(e: any) => setForm({ ...form, name: e.target.value })}
              value={form.name}
            />
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", mb: 2 }}>
          {onCancel && (
            <Button onClick={onCancel} variant="outlined" sx={{ mr: 2, flex: "50%" }}>
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            variant="contained"
            sx={{ flex: "50%" }}
            disabled={!form.start || !form.end || !form.name}
          >
            {timeEntry ? "Update" : "Create"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
