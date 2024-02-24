import { ReactElement, ReactEventHandler } from "react";

import { Box, useTheme } from "@mui/material";

export default function ActionCardBtn({
  onClick,
  children,
}: {
  onClick?: ReactEventHandler;
  children: ReactElement[];
}) {
  const theme = useTheme();
  return (
    <Box
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick && onClick(e);
      }}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "3px",
        p: "3px 4px",
        pr: "8px",
        m: 0,
        fontSize: "0.9rem",
        "&:hover": {
          background: theme.palette.action.hover,
          cursor: "pointer",
        },
      }}
    >
      {...children}
    </Box>
  );
}
