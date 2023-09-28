import useSWR from "swr";

import * as React from "react";
import SwipeableViews from "react-swipeable-views";

import { Paper, Skeleton } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";

import { fetcher } from "@lib/net";
import { hoursToTime } from "@lib/utils";

import TasksList from "@components/dashboard/TasksList";
import ElapsedTime from "@components/time-entry/ElapsedTime";

import useIsInView from "@hooks/useIsInView";

import { Task } from "../../types";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const REFRESH_EVERY_MS = 5000;

export default function Tasks() {
  const ref = React.useRef<HTMLElement>(null);
  const isInView = useIsInView(ref);
  const [value, setValue] = React.useState(0);

  const { data: dataMyTasks, isLoading: isLoadingMyTasks } = useSWR(isInView ? "/api/tasks/current" : null, fetcher, {
    refreshInterval: REFRESH_EVERY_MS,
  });

  const totalMyTasksWorkedTime = React.useMemo(() => {
    if (!dataMyTasks) {
      return 0;
    }

    return dataMyTasks.reduce(
      (total: number, task: Task) => Number((total + task.subtask_effective_hours + task.effective_hours).toFixed(2)),
      0,
    );
  }, [dataMyTasks]);

  const { data: dataAudit, isLoading: isLoadingAudit } = useSWR(value === 1 ? "/api/tasks/audit" : null, fetcher, {
    refreshInterval: REFRESH_EVERY_MS,
  });

  const totalWorkedTimeAudit = React.useMemo(() => {
    if (!dataAudit) {
      return 0;
    }

    return dataAudit.reduce(
      (total: number, task: Task) => Number((total + task.subtask_effective_hours + task.effective_hours).toFixed(2)),
      0,
    );
  }, [dataAudit]);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  const hasPendingTasks = !isLoadingMyTasks && totalMyTasksWorkedTime > 0;

  return (
    <Box ref={ref}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="tasks tabs">
          <Tab label="My Tasks" {...a11yProps(0)} />
          <Tab label="Tasks Audit Log" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box sx={{ mr: 2, width: hasPendingTasks ? "calc(100% - 150px)" : "100%" }}>
            {(isLoadingMyTasks || !dataMyTasks) && (
              <Typography variant="h6" sx={{ mb: 2 }}>
                <Skeleton />
              </Typography>
            )}
            {!isLoadingMyTasks && !!dataMyTasks && (
              <Typography variant="h6" sx={{ mb: 2 }}>
                {hasPendingTasks
                  ? "This list is in real time and it shows your unapproved tasks so far"
                  : "All your tasks are approved"}
              </Typography>
            )}
          </Box>
          {hasPendingTasks && (
            <ElapsedTime
              elapsedTime={totalMyTasksWorkedTime * 3600}
              isLoading={isLoadingMyTasks}
              withLabels
              hideSeconds
            />
          )}
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ mr: 2, width: "calc(100% - 150px)" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              This list is in real time and it shows all the contributors unapproved tasks so far
            </Typography>
          </Box>
          <ElapsedTime elapsedTime={totalWorkedTimeAudit * 3600} isLoading={isLoadingAudit} withLabels hideSeconds />
        </Box>
      </TabPanel>
      <SwipeableViews index={value} onChangeIndex={handleChangeIndex}>
        <TabPanel value={value} index={0}>
          <TasksList tasks={dataMyTasks as Task[]} isLoading={isLoadingMyTasks} showUser={false} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <TasksList tasks={dataAudit as Task[]} isLoading={isLoadingAudit} />
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
}
