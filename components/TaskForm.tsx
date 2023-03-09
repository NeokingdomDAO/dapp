import { format } from "date-fns";

import { useState } from "react";

import { Box, Button, FormControl, FormLabel, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import { ProjectTask } from "@store/projectTaskStore";

export default function TaskForm({
  task,
  onConfirm,
  onCancel,
}: {
  task?: ProjectTask;
  onConfirm: (data: any) => void;
  onCancel?: () => void;
}) {
  const now = new Date();
  const dateFormat = "yyyy-MM-dd HH:mm:ss";

  const [form, setForm] = useState<{ start: string; end?: string; name: string }>({
    start: format(now, dateFormat),
    end: format(now, dateFormat),
    name: "",
    ...(task || {}),
  });

  const onSubmit = async (event: any) => {
    event.preventDefault();
    const data = { ...(task || {}), ...form };
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
          <TextField
            sx={{ width: "100%" }}
            id="newEntry-description"
            label="Description"
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

          <Button
            type="submit"
            variant="contained"
            sx={{ flex: "50%" }}
            disabled={!form.start || !form.end || !form.name}
          >
            {task ? "Update" : "Create"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
