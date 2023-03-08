import { format } from "date-fns";

import { ChangeEvent, SyntheticEvent, useState } from "react";

import { Box, Button, FormControl, FormLabel, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import useProjectTaskStore, { ProjectTask, Timesheet } from "@store/projectTaskStore";

import TextArea from "./TextArea";

export default function EditTimeEntry({
  timeEntry,
  task,
  onUpdate,
  onCancel,
}: {
  timeEntry: Timesheet;
  task: ProjectTask;
  onUpdate: (data: any) => void;
  onCancel?: (data: any) => void;
}) {
  const updateTimeEntry = useProjectTaskStore((state) => state.updateTimeEntry);

  const [form, setForm] = useState<{ start: string; end?: string; name: string }>({
    start: timeEntry.start,
    end: timeEntry.end,
    name: timeEntry.name,
  });

  const onSubmit = async (event: any) => {
    event.preventDefault();
    const data = { ...timeEntry, ...form };
    updateTimeEntry(data, task);
    onUpdate && onUpdate(data);
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
            onChange={(datetime: Date) => setForm({ ...form, start: format(datetime, "yyyy-MM-dd HH:mm:ss") })}
          />
          <DateTimePicker
            sx={{ ml: 2 }}
            required
            label="End"
            format="yyyy/MM/dd HH:mm"
            ampm={false}
            value={form.end ? new Date(form.end) : null}
            onChange={(datetime: Date) => setForm({ ...form, end: format(datetime, "yyyy-MM-dd HH:mm:ss") })}
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
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
