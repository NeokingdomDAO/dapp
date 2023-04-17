import { useState } from "react";

import { Add } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";

import { toPrettyDuration } from "@lib/utils";

import { ProjectTask, useProjectTaskActions } from "@store/projectTaskStore";

import useErrorHandler from "@hooks/useErrorHandler";

import Stopwatch from "./Stopwatch";
import TimeEntry from "./TimeEntry";
import TimeEntryForm from "./TimeEntryForm";

export default function TaskCard({ task }: { task: ProjectTask }) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<number | false>(false);
  const [newTimeEntry, addNewTimeEntry] = useState<boolean>(false);

  const onStopwatchClick = (taskId: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    event.preventDefault();
    setExpanded(isExpanded ? taskId : false);
  };

  const { handleError } = useErrorHandler();
  const actions = useProjectTaskActions();
  const createTimeEntry = handleError(actions.createTimeEntry);

  return (
    <Card
      variant="outlined"
      sx={{
        position: "relative",
        margin: "10px auto",
      }}
    >
      <CardHeader
        title={task.name}
        titleTypographyProps={{
          variant: "h6",
          lineHeight: "1.5rem",
        }}
      />
      <CardContent sx={{ pt: 0 }}>
        <Accordion
          sx={{ border: 0 }}
          variant="outlined"
          expanded={expanded === task.id}
          onChange={onStopwatchClick(task.id)}
        >
          <AccordionSummary
            sx={{
              p: 0,
              minHeight: 0,
              "&.Mui-expanded": { minHeight: 0 },
              "& .MuiAccordionSummary-content": { margin: 0 },
              "& .MuiAccordionSummary-content.Mui-expanded": { margin: 0 },
            }}
          >
            <Stopwatch task={task} />
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0, pt: "8px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography>
                <strong>Total time:</strong>
                <span>{toPrettyDuration(task.effective_hours)}</span>
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Add />}
                size="small"
                onClick={() => addNewTimeEntry(!newTimeEntry)}
              >
                New Time Entry
              </Button>
            </Box>
            <Grid container sx={{ m: 0, width: "100%" }} spacing={0}>
              {newTimeEntry && (
                <Grid item sx={{ pl: 0, pt: 0, p: 0 }} xs={12} sm={4}>
                  <Box
                    sx={{
                      m: "5px",
                      ml: 0,
                      p: "5px",
                      borderRadius: "3px",
                      border: `1px solid ${theme.palette.divider}`,
                      position: "relative",
                    }}
                  >
                    <TimeEntryForm
                      onConfirm={(data) => {
                        createTimeEntry(data, task);
                        addNewTimeEntry(false);
                      }}
                      onCancel={() => addNewTimeEntry(false)}
                    />
                  </Box>
                </Grid>
              )}
              {task.timesheet_ids.map((row) => (
                <Grid item sx={{ pl: 0, pt: 0, p: 0 }} xs={12} sm={4} key={row.id}>
                  <TimeEntry task={task} timeEntry={row} />
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
}
