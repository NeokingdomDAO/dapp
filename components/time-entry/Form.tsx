import { useRouter } from "next/router";
import useSWR from "swr";
import { shallow } from "zustand/shallow";

import { useEffect, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
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
import useTimeEntryStore from "@store/timeEntry";

import useGetClashingTimeEntry from "@hooks/useGetClashingTimeEntry";
import { useSnackbar } from "@hooks/useSnackbar";
import useUserProjects from "@hooks/useUserProjects";

import ElapsedTime from "./ElapsedTime";

type StateType = {
  startTime: Date;
  endTime: Date;
  disabledEditStart: boolean;
  disabledEditEnd: boolean;
  tier_id?: { id: number };
};

const ONE_MINUTE_IN_SECONDS = 60;
const THREE_HOURS_IN_SECONDS = 3 * 60 * 60;

export default function TimeEntryForm() {
  const { startAt, stopAt, resume, description, setDescription, reset, taskId, setTaskId, setStartAt } =
    useTimeEntryStore(
      (state) => ({
        startAt: state.startAt,
        stopAt: state.stopAt,
        taskId: state.taskId,
        resume: state.resume,
        reset: state.reset,
        setTaskId: state.setTaskId,
        setStartAt: state.setStartAt,
        description: state.description,
        setDescription: state.setDescription,
        tier_id: { id: state.tier_id },
      }),
      shallow,
    );

  const { enqueueSnackbar } = useSnackbar();

  const { createTimeEntry, loadingTimeEntry } = useProjectTaskStore((state) => ({
    createTimeEntry: state.actions.createTimeEntry,
    loadingTimeEntry: state.loadingTimeEntry,
  }));

  const [shouldConfirm, setShouldConfirm] = useState(false);

  const router = useRouter();
  const { userTasks, isLoading, userProjects } = useUserProjects();
  const { data: tiers } = useSWR<Project[]>("/api/tiers", fetcher);

  const [formData, setFormData] = useState<StateType>(() => ({
    startTime: new Date(startAt as number),
    endTime: new Date(stopAt as number),
    disabledEditStart: true,
    disabledEditEnd: true,
  }));

  const clashingEntry = useGetClashingTimeEntry({
    timeEntryId: null,
    startTime: formData.startTime,
    endTime: formData.endTime,
  });

  useEffect(() => {
    if (!Array.isArray(userTasks) || userTasks.length === 0 || taskId === null) {
      return;
    }
    if (!userTasks.find((t: any) => t.id === taskId)) {
      setTaskId(null);
    }
  }, [userTasks, taskId]);

  if (isLoading) {
    return <CircularProgress />;
  }

  const onChangeStartTime = (newValue: Date | null) => {
    if (!newValue) {
      return;
    }
    setFormData((prev) => ({ ...prev, startTime: newValue }));
    setStartAt(newValue.getTime());
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
        startTime: disabledEditStart ? new Date(startAt as number) : prev.startTime,
      };
    });
  };

  const toggleEditEnd = () => {
    setFormData((prev) => {
      const disabledEditEnd = !prev.disabledEditEnd;
      return { ...prev, disabledEditEnd, endTime: disabledEditEnd ? new Date(stopAt as number) : prev.endTime };
    });
  };

  const goToNewTask = (path?: string) => {
    resume();
    router.push(path || "/tasks/new");
  };

  const create = async () => {
    const { error, alert } = await createTimeEntry(
      {
        id: -1,
        start: formData.startTime.getTime(),
        end: formData.endTime.getTime(),
        name: description,
        tier_id: formData.tier_id?.id,
      },
      taskId as number,
    );

    if (alert) {
      enqueueSnackbar(alert.message, { variant: alert.variant });
      return reset();
    }

    enqueueSnackbar(error.message, { variant: "error" });
  };

  const isValidTime =
    formData.startTime && formData.endTime && formData.startTime.getTime() < formData.endTime.getTime();

  const elapsedTime = Math.floor((formData.endTime.getTime() - formData.startTime.getTime()) / 1000);
  const descriptionFilled = description.trim().length > 0;
  const isValid =
    taskId &&
    isValidTime &&
    !clashingEntry &&
    descriptionFilled &&
    elapsedTime > ONE_MINUTE_IN_SECONDS &&
    (shouldConfirm || elapsedTime < THREE_HOURS_IN_SECONDS);

  const options = userTasks.map((userTask: any) => ({
    label: getTaskName(userTask),
    id: userTask.id,
    projectName: userTask.projectName,
    projectId: userTask.projectId,
  }));

  const selectedOption = options.find((option) => option.id === taskId) || null;

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
          renderInput={(params) => <TextField {...params} label={!taskId ? "Task *" : "Task"} />}
          renderGroup={(params) => {
            const project = userProjects?.find((p: any) => p.id === params.group);
            return (
              <div>
                <Box sx={{ p: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="caption">{project?.name}</Typography>
                  <Button
                    startIcon={<AddIcon />}
                    size="small"
                    onClick={() => goToNewTask(`/tasks/new?projectId=${params.group}`)}
                  >
                    New task
                  </Button>
                </Box>
                {params.children}
              </div>
            );
          }}
          groupBy={(option) => option.projectId}
          onChange={(_, newValue) => {
            if (newValue?.id === -1) {
              return goToNewTask();
            }
            setTaskId(newValue?.id);
          }}
        />
      ) : (
        <Button onClick={() => goToNewTask()} fullWidth variant="outlined">
          Create a new task
        </Button>
      )}
      <TextField
        id="time-entry-description"
        label={description.trim().length === 0 ? "Description *" : "Description"}
        placeholder="Please describe the time entry"
        multiline
        maxRows={4}
        minRows={2}
        sx={{ width: "100%", mt: 2 }}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
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
          sx={{ width: "calc(100% - 100px)" }}
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
          sx={{ width: "calc(100% - 100px)" }}
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
      {isValidTime && !clashingEntry && (
        <>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <ElapsedTime withLabels elapsedTime={elapsedTime} hideSeconds={elapsedTime >= ONE_MINUTE_IN_SECONDS} />
            <LoadingButton variant="contained" disabled={!isValid} loading={loadingTimeEntry === -1} onClick={create}>
              Save entry
            </LoadingButton>
          </Stack>
          {elapsedTime >= THREE_HOURS_IN_SECONDS && (
            <Alert severity="warning" sx={{ mt: 1, mb: 1 }}>
              <b>Heads up:</b> this time entry is a bit suspicious. You&apos;re tracking a single task of more than 3
              hour.
              <FormControlLabel
                sx={{ display: "block", p: 2 }}
                control={<Switch defaultChecked />}
                label={`I know what I'm doing, enable save`}
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
