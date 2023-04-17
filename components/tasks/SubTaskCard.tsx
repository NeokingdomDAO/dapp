import { Box, useTheme } from "@mui/material";

import { ProjectTask } from "@store/projectTaskStore";

export default function SubTaskCard({ task }: { task: ProjectTask }) {
  const theme = useTheme();
  return (
    <Box sx={{ p: "8px", border: `1px solid ${theme.palette.divider}`, borderRadius: "3px", mb: "4px" }}>
      {task.name}
    </Box>
  );
}
