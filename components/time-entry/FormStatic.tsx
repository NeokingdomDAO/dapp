import { formatInTimeZone } from "date-fns-tz";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";

import { LoadingButton } from "@mui/lab";
import { Alert, Autocomplete, Box, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { DateTimeField } from "@mui/x-date-pickers";

import { ODOO_DATE_FORMAT } from "@lib/constants";

import useProjectTaskStore from "@store/projectTaskStore";

import { useSnackbar } from "@hooks/useSnackbar";
import useUserProjects from "@hooks/useUserProjects";

import ElapsedTime from "./ElapsedTime";

type StateType = {
  startTime: Date;
  endTime: Date;
  description: string;
  disabledEditStart: boolean;
  disabledEditEnd: boolean;
  isLoading: boolean;
  taskId: number | null;
};

const ONE_MINUTE_IN_SECONDS = 60;
const TEN_HOURS_IN_SECONDS = 10 * 60 * 60;
const DEFAULT_TASK_DURATION = 120000; // 2 mins

export default function TimeEntryFormStatic({ taskId, onSaved }: { taskId: number; onSaved: () => void }) {
  const { enqueueSnackbar } = useSnackbar();
  const setProjectKey = useProjectTaskStore((state) => state.actions.setProjectKey);

  const router = useRouter();
  const { userTasks, isLoading, userProjects } = useUserProjects();

  const [formData, setFormData] = useState<StateType>(() => ({
    startTime: new Date(),
    endTime: new Date(Date.now() + DEFAULT_TASK_DURATION),
    disabledEditStart: true,
    disabledEditEnd: true,
    description: "",
    isLoading: false,
    taskId,
  }));

  useEffect(() => {
    if (!Array.isArray(userTasks) || userTasks.length === 0 || formData.taskId === null) {
      return;
    }
    if (!userTasks.find((t: any) => t.id === formData.taskId)) {
      setFormData((prev) => ({ ...prev, taskId: null }));
    }
  }, [userTasks, formData.taskId]);

  if (isLoading) {
    return <CircularProgress />;
  }

  const onChangeStartTime = (newValue: Date | null) => {
    if (!newValue) {
      return;
    }
    setFormData((prev) => ({ ...prev, startTime: newValue }));
  };

  const onChangeEndTime = (newValue: Date | null) => {
    if (!newValue) {
      return;
    }
    setFormData((prev) => ({ ...prev, endTime: newValue }));
  };

  const toggleEditStart = () => {
    setFormData((prev) => {
      const disabledEditStart = !prev.disabledEditStart;
      return {
        ...prev,
        disabledEditStart,
        startTime: disabledEditStart ? new Date() : prev.startTime,
      };
    });
  };

  const toggleEditEnd = () => {
    setFormData((prev) => {
      const disabledEditEnd = !prev.disabledEditEnd;
      return {
        ...prev,
        disabledEditEnd,
        endTime: disabledEditEnd ? new Date(Date.now() + DEFAULT_TASK_DURATION) : prev.endTime,
      };
    });
  };

  const goToNewTask = (path?: string) => {
    router.push(path || "/tasks/new");
  };

  const saveTimeEntry = async () => {
    setFormData((prev) => ({ ...prev, isLoading: true }));
    const response = await fetch(`/api/time_entries`, {
      method: "POST",
      body: JSON.stringify({
        task_id: formData.taskId,
        start: formatInTimeZone(formData.startTime, "UTC", ODOO_DATE_FORMAT),
        end: formatInTimeZone(formData.endTime, "UTC", ODOO_DATE_FORMAT),
        name: formData.description.trim() !== "" ? formData.description : "/",
      }),
    });
    if (response.ok) {
      setFormData((prev) => ({ ...prev, isLoading: false }));
      enqueueSnackbar("Time entry correctly saved", { variant: "success" });
      setProjectKey();
      onSaved();
    } else {
      setFormData((prev) => ({ ...prev, isLoading: false }));
      enqueueSnackbar("Error while saving time entry", { variant: "error" });
    }
  };

  const isValidTime =
    formData.startTime && formData.endTime && formData.startTime.getTime() < formData.endTime.getTime();

  const elapsedTime = Math.floor((formData.endTime.getTime() - formData.startTime.getTime()) / 1000);
  const isValid = formData.taskId && isValidTime && elapsedTime > ONE_MINUTE_IN_SECONDS;
  const options = userTasks.map((userTask: any) => ({
    label: userTask.name,
    id: userTask.id,
    projectName: userTask.projectName,
    projectId: userTask.projectId,
  }));

  const selectedOption = options.find((option) => option.id === formData.taskId) || null;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Save time entry
      </Typography>
      {options.length > 0 ? (
        <Autocomplete
          disablePortal
          id="user-task-selection"
          value={selectedOption}
          options={options}
          getOptionLabel={(option) => option.label}
          sx={{ width: "100%" }}
          renderInput={(params) => <TextField {...params} label="Task" />}
          renderGroup={(params) => {
            const project = userProjects?.find((p: any) => p.id === params.group);
            return (
              <div>
                <Box sx={{ p: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="caption">{project?.name}</Typography>
                </Box>
                {params.children}
              </div>
            );
          }}
          groupBy={(option) => option.projectId}
          onChange={(_, newValue) => {
            setFormData((prev) => ({ ...prev, taskId: newValue?.id }));
          }}
        />
      ) : (
        <Button onClick={() => goToNewTask()} fullWidth variant="outlined">
          Create a new task
        </Button>
      )}
      <TextField
        id="time-entry-description"
        label="Description"
        multiline
        maxRows={4}
        minRows={2}
        sx={{ width: "100%", mt: 2 }}
        value={formData.description}
        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
      />
      <Box mt={2} sx={{ display: "flex", alignItems: "center" }}>
        <DateTimeField
          ampm={false}
          label="Start time"
          value={formData.startTime}
          onChange={onChangeStartTime}
          sx={{ width: "50%" }}
          disabled={formData.disabledEditStart}
          size="small"
          maxDateTime={formData.endTime}
          format="dd/MM/yyyy H:mm"
        />
        <Button variant="outlined" size="small" sx={{ ml: 2 }} onClick={toggleEditStart}>
          {formData.disabledEditStart ? "edit" : "discard"}
        </Button>
      </Box>

      <Box mt={2} sx={{ display: "flex", alignItems: "center" }}>
        <DateTimeField
          ampm={false}
          label="End time"
          value={formData.endTime}
          onChange={onChangeEndTime}
          sx={{ width: "50%" }}
          disabled={formData.disabledEditEnd}
          size="small"
          minDateTime={formData.startTime}
          format="dd/MM/yyyy H:mm"
        />
        <Button variant="outlined" size="small" sx={{ ml: 2 }} onClick={toggleEditEnd}>
          {formData.disabledEditEnd ? "edit" : "discard"}
        </Button>
      </Box>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Total entry time
      </Typography>
      {isValidTime ? (
        <>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <ElapsedTime withLabels elapsedTime={elapsedTime} hideSeconds={elapsedTime >= ONE_MINUTE_IN_SECONDS} />
            <LoadingButton variant="contained" disabled={!isValid} loading={formData.isLoading} onClick={saveTimeEntry}>
              Save entry
            </LoadingButton>
          </Stack>
          {elapsedTime > TEN_HOURS_IN_SECONDS && (
            <Alert severity="warning" sx={{ mt: 1, mb: 1 }}>
              <b>Heads up:</b> this time entry is a bit suspicious. You&apos;re tracking a single task of more than 10
              hour.
            </Alert>
          )}
          {elapsedTime < ONE_MINUTE_IN_SECONDS && (
            <Alert severity="warning" sx={{ mt: 1, mb: 1 }}>
              <b>Heads up:</b> this time entry needs to be longer than 1 minute. Please manually update it, or continue
              tracking
            </Alert>
          )}
        </>
      ) : (
        <Alert severity="error">Please note the start date should be before the end date</Alert>
      )}
    </Box>
  );
}
