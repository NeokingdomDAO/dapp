import { useState } from "react";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  CardHeader,
  Typography,
  useTheme,
} from "@mui/material";

import { ProjectTask } from "@store/projectTaskStore";

import { toPrettyDuration } from "../../lib/utils";
import Stopwatch from "./Stopwatch";

export default function TaskCard({ task }: { task: ProjectTask }) {
  const theme = useTheme();

  const [expanded, setExpanded] = useState<number | false>(false);

  const onStopwatchClick = (taskId: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    event.preventDefault();
    setExpanded(isExpanded ? taskId : false);
  };

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
            <Typography>
              <strong>Total time:</strong>
              <span>{toPrettyDuration(task.effective_hours)}</span>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
}
