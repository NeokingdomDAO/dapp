import { useState } from "react";

import { Box, Button, TextField, TextareaAutosize } from "@mui/material";

import useProjectTaskStore, { ProjectTask, Timesheet } from "@store/projectTaskStore";

export default function EditTimeEntry({
  timeEntry,
  task,
  onUpdate,
}: {
  timeEntry: Timesheet;
  task: ProjectTask;
  onUpdate: (data: any) => void;
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
    <Box component="form" onSubmit={onSubmit} autoComplete="off">
      <Box sx={{ mt: 3 }}>
        <TextField
          required
          id="newEntry-start"
          name="newEntry-start"
          label="Start"
          onChange={(e) => setForm({ ...form, start: e.target.value })}
          value={form.start}
        />
        <TextField
          required
          id="newEntry-start"
          name="newEntry-start"
          label="End"
          onChange={(e) => setForm({ ...form, end: e.target.value })}
          value={form.end}
        />
      </Box>
      <Box sx={{ mt: 2, mb: 2 }}>
        <TextareaAutosize
          aria-label="newEntry-description"
          placeholder="Description"
          minRows={3}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          value={form.name}
        />
      </Box>
      <Button
        type="submit"
        variant="contained"
        size="small"
        fullWidth
        disabled={!form.start || !form.end || !form.name}
      >
        Save
      </Button>
    </Box>
  );
}
