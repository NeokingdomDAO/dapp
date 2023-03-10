import { compareAsc, endOfMonth, format } from "date-fns";
import useSWR from "swr";

import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

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

import { Project, ProjectTask, Tier } from "@store/projectTaskStore";

import useUser from "@hooks/useUser";

import { OdooUser } from "../types";

type FormData = {
  name: string;
  date_deadline: string;
  user_id: number | undefined;
  approval_user_id: number | undefined;
  tier_id: number;
  project_id: number | undefined;
  tag_ids: number[];
};

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
  const { data: tiers } = useSWR<Project[]>("/api/tiers", fetcher);

  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  const [lastTask, setLastTask] = useState<ProjectTask | undefined>();
  const dateFormat = "yyyy-MM-dd HH:mm:ss";

  const defaultValues = useMemo(
    () => ({
      name: task ? task.name : "",
      project_id: task ? task.project_id.id : selectedProject?.id || -1,
      tag_ids: task ? task.tag_ids.map((tag) => tag.id) : lastTask?.tag_ids?.map((tag) => tag.id) || [],
      user_id: task ? task.user_id.id : user?.id || -1,
      approval_user_id: task ? task.approval_user_id.id : lastTask?.approval_user_id?.id || -1,
      tier_id: task ? task.tier_id.id : lastTask?.tier_id?.id || -1,
      date_deadline: task ? task.date_deadline : format(endOfMonth(new Date()), dateFormat),
    }),
    [selectedProject, lastTask, user, task],
  );

  const { control, reset, handleSubmit } = useForm<FormData>({ defaultValues });

  useEffect(() => {
    if (projects?.length && !selectedProject) {
      setSelectedProject(projects[0]);
      const lastTask = projects[0].tasks
        .sort((a, b) => compareAsc(new Date(a.write_date), new Date(b.write_date)))
        .pop();
      setLastTask(lastTask);
    }
  }, [projects, selectedProject]);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center" }}
      component="form"
      onSubmit={handleSubmit(onConfirm)}
      autoComplete="off"
    >
      <Grid sx={{ width: "100%", maxWidth: "500px" }} container spacing={2} justifyContent="center">
        <Grid item xs={12}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField required sx={{ mt: 3, width: "100%" }} id="task-title" label="Title" {...field} />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="task-project">Project</InputLabel>
            <Controller
              name="project_id"
              control={control}
              render={({ field: { onChange, value, ...fields } }) => (
                <Select
                  labelId="task-project"
                  id="task-project-select"
                  value={value}
                  onChange={(e) => onChange(Number(e.target.value))}
                  label="Project"
                  {...fields}
                >
                  {projects?.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="task-tags">Tags</InputLabel>
            <Controller
              name="tag_ids"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="task-tags"
                  id="task-tags-select"
                  multiple
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
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="task-assignee">Assignee</InputLabel>
            <Controller
              name="user_id"
              control={control}
              render={({ field }) => (
                <Select labelId="task-assignee" id="task-assignee-select" label="Assignee" {...field}>
                  {users?.map((user: OdooUser) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="task-tier">Tier</InputLabel>
            <Controller
              name="tier_id"
              control={control}
              render={({ field }) => (
                <Select labelId="task-tier" id="task-tier-select" label="Tier" {...field}>
                  {tiers?.map((tier: Tier) => (
                    <MenuItem key={tier.id} value={tier.id}>
                      {tier.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="task-assignee">Controller</InputLabel>
            <Controller
              name="approval_user_id"
              control={control}
              render={({ field }) => (
                <Select labelId="task-controller" id="task-controller-select" label="Controller" {...field}>
                  {users?.map((user: OdooUser) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="date_deadline"
            control={control}
            render={({ field: { onChange, value, ...fields } }) => (
              <DateTimePicker
                sx={{ width: "100%" }}
                label="Deadline"
                format="yyyy/MM/dd HH:mm"
                ampm={false}
                value={new Date(value)}
                onChange={(datetime: any) => onChange(format(datetime, dateFormat))}
                {...fields}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: "flex", mb: 2 }}>
            {onCancel && (
              <Button onClick={onCancel} variant="outlined" sx={{ mr: 2, flex: "50%" }}>
                Cancel
              </Button>
            )}

            <Button type="submit" variant="contained" sx={{ flex: "50%" }}>
              {task ? "Update" : "Create"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
