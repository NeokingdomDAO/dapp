import { endOfMonth, format } from "date-fns";
import useSWR from "swr";
import { shallow } from "zustand/shallow";

import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import { fetcher } from "@lib/net";

import useProjectTaskStore, { Project, ProjectTask, Tier } from "@store/projectTaskStore";

import useUser from "@hooks/useUser";

import { OdooUser } from "../types";

type FormType = {
  name: string;
  date_deadline: string;
  user_id: number | undefined;
  approval_user_id: number | undefined;
  tier_id: number;
  project_id: number | undefined;
  tag_ids: number[];
};

const TIER_IDS = [{ id: 1, name: "Staff" }];

export default function TaskForm({
  task,
  onConfirm,
  onCancel,
}: {
  task?: ProjectTask;
  onConfirm: (data: any) => void;
  onCancel?: () => void;
}) {
  const { user } = useUser();
  const { data: users } = useSWR<OdooUser[]>("/api/users", fetcher);
  const { data: projects } = useSWR<Project[]>("/api/projects", fetcher);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  const dateFormat = "yyyy-MM-dd HH:mm:ss";

  const defaultFormState = useMemo(
    () => ({
      name: task ? task.name : "",
      user_id: task ? task.user_id.id : user?.id,
      approval_user_id: task ? task.approval_user_id.id : -1,
      tier_id: task ? task.tier_id.id : -1,
      project_id: task ? task.project_id.id : selectedProject?.id,
      date_deadline: task ? task.date_deadline : format(endOfMonth(new Date()), dateFormat),
      tag_ids: task ? task.tag_ids.map((tag) => tag.id) : [],
    }),
    [selectedProject, user, task],
  );
  const [form, setForm] = useState<FormType>(defaultFormState);

  useEffect(() => {
    if (projects?.length && !selectedProject) {
      setSelectedProject(projects[0]);
    }
  }, [projects, selectedProject]);

  useEffect(() => {
    if (selectedProject) {
      setForm(defaultFormState);
    }
  }, [selectedProject, defaultFormState]);

  const onSubmit = async (event: any) => {
    event.preventDefault();
    const data = { ...(task || {}), ...form };
    onConfirm(data);
  };

  const handleProjectChange = (evt: any) => {
    const project_id = Number(evt.target.value);
    setSelectedProject(projects?.find((project) => project.id === project_id));
    setForm({ ...form, project_id });
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }} component="form" onSubmit={onSubmit} autoComplete="off">
      <Grid sx={{ width: "100%", maxWidth: "500px" }} container spacing={2} justifyContent="center">
        <Grid item xs={12}>
          <TextField
            required
            sx={{ mt: 3, width: "100%" }}
            id="task-title"
            label="Title"
            value={form.name}
            onChange={(evt) => setForm({ ...form, name: evt.target.value, tag_ids: [] })}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="task-project">Project</InputLabel>
            <Select
              labelId="task-project"
              id="task-project-select"
              value={form.project_id}
              label="Project"
              onChange={handleProjectChange}
            >
              {projects?.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="task-tags">Tags</InputLabel>
            <Select
              labelId="task-tags"
              id="task-tags-select"
              multiple
              value={form.tag_ids}
              onChange={(evt: any) => setForm({ ...form, tag_ids: evt.target.value })}
              input={<OutlinedInput id="select-multiple-tags" label="Tags" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      sx={{ height: "23px" }}
                      key={value}
                      label={selectedProject?.tag_ids.find((tag) => tag.id === value)?.name}
                    />
                  ))}
                </Box>
              )}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 224,
                    width: 235,
                  },
                },
              }}
            >
              {selectedProject?.tag_ids.map((tag) => (
                <MenuItem key={tag.id} value={tag.id}>
                  {tag.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="task-assignee">Assignee</InputLabel>
            <Select
              labelId="task-assignee"
              id="task-assignee-select"
              value={form.user_id}
              label="Assignee"
              onChange={(evt) => setForm({ ...form, user_id: Number(evt.target.value) })}
            >
              {users?.map((user: OdooUser) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="task-tier">Tier</InputLabel>
            <Select
              labelId="task-tier"
              id="task-tier-select"
              value={form.tier_id}
              label="Tier"
              onChange={(evt) => setForm({ ...form, tier_id: Number(evt.target.value) })}
            >
              {TIER_IDS?.map((tier: Tier) => (
                <MenuItem key={tier.id} value={tier.id}>
                  {tier.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="task-assignee">Controller</InputLabel>
            <Select
              labelId="task-controller"
              id="task-controller-select"
              value={form.approval_user_id}
              label="Controller"
              onChange={(evt) => setForm({ ...form, approval_user_id: Number(evt.target.value) })}
            >
              {users?.map((user: OdooUser) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <DateTimePicker
            sx={{ width: "100%" }}
            label="Start"
            format="yyyy/MM/dd HH:mm"
            ampm={false}
            value={form.date_deadline ? new Date(form.date_deadline) : null}
            onChange={(datetime: any) => setForm({ ...form, date_deadline: format(datetime, dateFormat) })}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: "flex", mb: 2 }}>
            {onCancel && (
              <Button onClick={onCancel} variant="outlined" sx={{ mr: 2, flex: "50%" }}>
                Cancel
              </Button>
            )}

            <Button type="submit" variant="contained" sx={{ flex: "50%" }} disabled={!form.name}>
              {task ? "Update" : "Create"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
