import { useRouter } from "next/router";
import useSWR from "swr";

import { useEffect, useState } from "react";

import { LoadingButton } from "@mui/lab";
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimeField } from "@mui/x-date-pickers";

import { fetcher } from "@lib/net";
import { getTaskName, toPrettyRange } from "@lib/utils";

import useProjectTaskStore, { Project, Tier } from "@store/projectTaskStore";

import useGetClashingTimeEntry from "@hooks/useGetClashingTimeEntry";
import { useSnackbar } from "@hooks/useSnackbar";
import useUserProjects from "@hooks/useUserProjects";

import ElapsedTime from "./ElapsedTime";

type StateType = {
  startTime: Date;
  endTime: Date;
  description: string;
  taskId: number | null;
  timeEntryId?: number | null;
  tier_id?: { id: number };
};

const ONE_MINUTE_IN_SECONDS = 60;
const THREE_HOURS_IN_SECONDS = 3 * 60 * 60;
const DEFAULT_TASK_DURATION = 120000; // 2 mins

export default function TimeEntryFormStatic({
  taskId,
  onSaved,
  savedFormData,
  onDeleteTimeEntry,
}: {
  taskId: number;
  onSaved: () => void;
  savedFormData?: Partial<StateType>;
  onDeleteTimeEntry?: () => void;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const { createTimeEntry, updateTimeEntry, loadingTimeEntry } = useProjectTaskStore((state) => ({
    createTimeEntry: state.actions.createTimeEntry,
    updateTimeEntry: state.actions.updateTimeEntry,
    loadingTimeEntry: state.loadingTimeEntry,
  }));

  const router = useRouter();
  const { userTasks, isLoading, userProjects } = useUserProjects();
  const { data: tiers } = useSWR<Project[]>("/api/tiers", fetcher);

  const [formData, setFormData] = useState<StateType>(() => ({
    startTime: savedFormData?.startTime || new Date(),
    endTime: savedFormData?.endTime || new Date(Date.now() + DEFAULT_TASK_DURATION),
    description: savedFormData?.description || "",
    taskId,
    tier_id: savedFormData?.tier_id,
  }));

  const [shouldConfirm, setShouldConfirm] = useState(false);

  const clashingEntry = useGetClashingTimeEntry({
    timeEntryId: savedFormData?.timeEntryId,
    startTime: formData.startTime,
    endTime: formData.endTime,
  });

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

  const goToNewTask = (path?: string) => {
    router.push(path || "/tasks/new");
  };

  const create = async () => {
    const { error, alert } = await createTimeEntry(
      {
        id: -1,
        start: formData.startTime.getTime(),
        end: formData.endTime.getTime(),
        name: formData.description,
        tier_id: formData.tier_id?.id,
      },
      taskId,
    );

    if (alert) {
      enqueueSnackbar(alert.message, { variant: alert.variant });
      return onSaved();
    }

    enqueueSnackbar(error.message, { variant: "error" });
  };

  const update = async () => {
    const { error, alert } = await updateTimeEntry({
      start: formData.startTime.getTime(),
      end: formData.endTime.getTime(),
      name: formData.description,
      id: savedFormData?.timeEntryId as number,
      tier_id: formData.tier_id?.id,
    });

    if (alert) {
      enqueueSnackbar(alert.message, { variant: alert.variant });
      return onSaved();
    }

    enqueueSnackbar(error.message, { variant: "error" });
  };

  const isValidTime =
    formData.startTime && formData.endTime && formData.startTime.getTime() < formData.endTime.getTime();

  const elapsedTime = Math.floor((formData.endTime.getTime() - formData.startTime.getTime()) / 1000);
  const descriptionFilled = formData.description.trim().length > 0;
  const isValid =
    formData.taskId &&
    isValidTime &&
    elapsedTime > ONE_MINUTE_IN_SECONDS &&
    descriptionFilled &&
    !clashingEntry &&
    (shouldConfirm || elapsedTime < THREE_HOURS_IN_SECONDS);

  const options = userTasks.map((userTask: any) => ({
    label: getTaskName(userTask),
    id: userTask.id,
    projectName: userTask.projectName,
    projectId: userTask.projectId,
  }));

  const selectedOption = options.find((option) => option.id === formData.taskId) || null;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {!!savedFormData ? "Update" : "New"} time entry
      </Typography>
      {options.length > 0 ? (
        <Autocomplete
          disablePortal
          id="user-task-selection"
          value={selectedOption}
          options={options}
          getOptionLabel={(option) => option.label}
          sx={{ width: "100%" }}
          renderInput={(params) => <TextField {...params} label={!formData?.taskId ? "Task *" : "Task"} />}
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
        label={formData.description.trim().length === 0 ? "Description *" : "Description"}
        placeholder="Please describe the time entry"
        multiline
        maxRows={4}
        minRows={2}
        sx={{ width: "100%", mt: 2 }}
        value={formData.description}
        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
      />
      <Box mt={2} sx={{ display: "flex", alignItems: "center" }}>
        <FormControl fullWidth>
          <InputLabel id="task-tier">Override Tier (optional)</InputLabel>
          <Select
            required
            labelId="task-tier"
            id="task-tier-select"
            label="Override Tier (optional)"
            value={formData.tier_id?.id}
            onChange={(e) => {
              const isEmptyString = e.target.value === "";
              setFormData((prev) => ({
                ...prev,
                tier_id: !isEmptyString ? { id: Number(e.target.value) } : undefined,
              }));
            }}
          >
            <MenuItem value={""} aria-label="None"></MenuItem>
            {tiers?.map((tier: Tier) => (
              <MenuItem key={tier.id} value={tier.id}>
                {tier.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box mt={2} sx={{ display: "flex", alignItems: "center" }}>
        <DateTimeField
          ampm={false}
          label="Start time"
          value={formData.startTime}
          onChange={onChangeStartTime}
          sx={{ width: "100%" }}
          size="small"
          maxDateTime={formData.endTime}
          format="dd/MM/yyyy H:mm"
        />
      </Box>
      <Box mt={2} sx={{ display: "flex", alignItems: "center" }}>
        <DateTimeField
          ampm={false}
          label="End time"
          value={formData.endTime}
          onChange={onChangeEndTime}
          sx={{ width: "100%" }}
          size="small"
          minDateTime={formData.startTime}
          format="dd/MM/yyyy H:mm"
        />
      </Box>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Total entry time
      </Typography>
      {isValidTime && !clashingEntry && (
        <>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <ElapsedTime withLabels elapsedTime={elapsedTime} hideSeconds={elapsedTime >= ONE_MINUTE_IN_SECONDS} />
            <LoadingButton
              variant="contained"
              disabled={!isValid}
              loading={loadingTimeEntry === -1 || loadingTimeEntry === savedFormData?.timeEntryId}
              onClick={() => (!!savedFormData ? update() : create())}
            >
              {!!savedFormData ? "Update" : "Save entry"}
            </LoadingButton>
          </Stack>
          {elapsedTime >= THREE_HOURS_IN_SECONDS && (
            <Alert severity="warning" sx={{ mt: 1, mb: 1 }}>
              <b>Heads up:</b> this time entry is a bit suspicious. You&apos;re tracking a single task of more than 3
              hour.
              <FormControlLabel
                sx={{ display: "block", p: 2 }}
                control={<Switch defaultChecked />}
                label={`I know what I'm doing, enable ${!!savedFormData ? "update" : "save"}`}
                checked={shouldConfirm}
                onChange={() => setShouldConfirm((prev) => !prev)}
              />
            </Alert>
          )}
          {elapsedTime < ONE_MINUTE_IN_SECONDS && (
            <Alert severity="warning" sx={{ mt: 1, mb: 1 }}>
              <b>Heads up:</b> this time entry needs to be longer than 1 minute. Please manually update it, or continue
              tracking
            </Alert>
          )}
          {!!savedFormData && (
            <>
              <Divider sx={{ mb: 2, mt: 2 }} />
              <Box sx={{ textAlign: "center" }}>
                <LoadingButton variant="outlined" onClick={onDeleteTimeEntry} color="error" size="small">
                  Delete entry
                </LoadingButton>
              </Box>
            </>
          )}
        </>
      )}
      {clashingEntry && isValidTime && (
        <Alert severity="error" sx={{ mt: 1, mb: 1 }}>
          <AlertTitle>This time entry is clashing with another entry</AlertTitle>
          <Typography variant="body2">Interval: {toPrettyRange(clashingEntry.start, clashingEntry.end)}</Typography>
          <Typography variant="body2">Description: {clashingEntry.name}</Typography>
          <Typography variant="body2">Task: {clashingEntry.parent.name}</Typography>
        </Alert>
      )}
      {!isValidTime && <Alert severity="error">Please note the start date should be before the end date</Alert>}
    </Box>
  );
}
