import * as React from "react";
import { ReactElement } from "react";

import { Close } from "@mui/icons-material";
import { IconButton, useTheme } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import MUIModal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

const sizeToWidth: Record<string, number> = {
  small: 400,
  medium: 600,
  large: 800,
};

const style = (size: string) => ({
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "90%",
    sm: sizeToWidth[size],
  },
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
});

export default function Modal({
  open,
  onClose,
  children,
  title,
  size = "medium",
}: {
  open: boolean;
  onClose?: () => void;
  children: ReactElement;
  title?: string;
  size?: "small" | "medium" | "large";
}) {
  const handleClose = () => {
    typeof onClose === "function" && onClose();
  };
  const theme = useTheme();

  return (
    <MUIModal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{
        backdrop: Backdrop,
      }}
      slotProps={{
        backdrop: {
          style: {
            backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(4px)",
          },
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style(size)}>
          <IconButton
            color="primary"
            aria-label="close"
            size="small"
            onClick={handleClose}
            sx={{ position: "absolute", top: 6, right: 6 }}
          >
            <Close />
          </IconButton>
          {title && (
            <Typography id="transition-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
              {title}
            </Typography>
          )}
          {children}
        </Box>
      </Fade>
    </MUIModal>
  );
}
