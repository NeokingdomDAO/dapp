import { compareAsc, endOfMonth, format } from "date-fns";
import useSWR from "swr";

import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Box, Button, FormControl, Grid, InputLabel, ListSubheader, MenuItem, Select, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { fetcher } from "@lib/net";
import { getDateFromOdooTimestamp } from "@lib/utils";
import { toDatetime } from "@lib/utils";

import { Project, ProjectTask } from "@store/projectTaskStore";

import useUser from "@hooks/useUser";

import { OdooUser } from "../../types";
import SearchSelect from "../SearchSelect";

type FormData = {
  name: string;
  date_deadline: string;
  user_ids: number[];
  approval_user_id: number | undefined;
  project_id: number | undefined;
  tag_ids: number[];
};

export default function TaskForm({
  task,
  parentTask,
  projectId,
  onConfirm,
  onCancel,
}: {
  task?: ProjectTask;
  parentTask?: ProjectTask;
  projectId?: number;
  onConfirm: (data: any) => void;
  onCancel?: () => void;
}) {
  const { user } = useUser();
  const { data: users } = useSWR<OdooUser[]>("/api/users", fetcher);
  const { data: projects } = useSWR<{ user: Project[]; other: Project[] }>("/api/projects/all", fetcher);
  const { data: tags } = useSWR<{ name: string; id: number }[]>("/api/tags", fetcher);

  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  const [lastTask, setLastTask] = useState<ProjectTask | undefined>();
  const dateFormat = "yyyy-MM-dd";

  const defaultValues = useMemo(
    () => ({
      name: task ? task.name : "",
      project_id: parentTask ? parentTask.project_id.id : task ? task.project_id.id : selectedProject?.id || undefined,
      tag_ids: parentTask
        ? parentTask.tag_ids.map((tag) => tag.id)
        : task
        ? task.tag_ids.map((tag) => tag.id)
        : lastTask?.tag_ids?.map((tag) => tag.id) || [],
      user_ids: parentTask?.user_ids
        ? parentTask.user_ids.map(({ id }) => id)
        : task?.user_ids
        ? task.user_ids.map(({ id }) => id)
        : [user?.id] || [],
      approval_user_id: parentTask?.approval_user_id
        ? parentTask.approval_user_id.id
        : task?.approval_user_id
        ? task.approval_user_id.id
        : lastTask?.approval_user_id?.id || -1,
      date_deadline: format(task ? toDatetime(task.date_deadline) : endOfMonth(new Date()), dateFormat),
    }),
    [selectedProject, lastTask, user, task, parentTask],
  );

  const { control, getValues, reset, handleSubmit } = useForm<FormData>({ defaultValues });

  useEffect(() => {
    if (projects?.user?.length) {
      const taskProject = task && !selectedProject && projects.user.find((proj) => proj.id === task.project_id.id);
      const parentProject =
        parentTask && !selectedProject && projects.user.find((proj) => proj.id === parentTask.project_id.id);
      const defaultProject = projectId && !selectedProject && projects.user.find((proj) => proj.id === projectId);
      const project = parentProject || taskProject || defaultProject || selectedProject;
      if (project) {
        if (!selectedProject) {
          setSelectedProject(project);
        }
        const [lastTask] = project.tasks
          .sort((a, b) => compareAsc(getDateFromOdooTimestamp(a.write_date), getDateFromOdooTimestamp(b.write_date)))
          .slice(-1);
        setLastTask(lastTask);
      }
    }
  }, [projects, selectedProject, projectId, task, parentTask]);

  const checkValues = (values: any, defaultValues: any) => (key: string) => {
    return values[key] && values[key] !== -1 ? values[key] : defaultValues[key];
  };

  useEffect(() => {
    const values = getValues();
    const getValue = checkValues(values, defaultValues);
    reset({
      name: getValue("name"),
      project_id: getValue("project_id"),
      tag_ids: defaultValues.tag_ids,
      user_ids: getValue("user_ids"),
      approval_user_id: getValue("approval_user_id"),
      date_deadline: getValue("date_deadline"),
    });
  }, [defaultValues, reset, getValues]);

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center" }}
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit(onConfirm)();
        reset(defaultValues);
      }}
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
                  required
                  disabled={Boolean(parentTask) || Boolean(task)}
                  value={value}
                  onChange={(e) => {
                    const projectId = Number(e.target.value);
                    const userProject = projects?.user.find((proj) => proj.id === projectId);
                    const otherProject = projects?.other.find((proj) => proj.id === projectId);
                    setSelectedProject(userProject || otherProject);
                    onChange(projectId);
                  }}
                  label="Project"
                  {...fields}
                >
                  <ListSubheader>My Projects</ListSubheader>
                  {projects?.user?.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                  <ListSubheader>Other</ListSubheader>
                  {projects?.other?.map((project) => (
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
              render={({ field }) => <SearchSelect field={field} options={tags || []} />}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="task-assignees">Assignees</InputLabel>
            <Controller
              name="user_ids"
              control={control}
              render={({ field }) => (
                <Select
                  multiple
                  required
                  labelId="task-assignees"
                  id="task-assignees-select"
                  label="Assignees"
                  {...field}
                >
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
            <InputLabel id="task-assignee">Controller</InputLabel>
            <Controller
              name="approval_user_id"
              control={control}
              render={({ field }) => (
                <Select required labelId="task-controller" id="task-controller-select" label="Controller" {...field}>
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
              <DatePicker
                sx={{ width: "100%" }}
                label="Deadline"
                format="yyyy/MM/dd"
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
