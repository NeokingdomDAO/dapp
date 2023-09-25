import * as React from "react";
import { ReactElement } from "react";

import { Close } from "@mui/icons-material";
import { IconButton, SxProps, Theme, useTheme } from "@mui/material";
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

const style = (size: string, sx: SxProps<Theme> = {}) => ({
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "90%",
    sm: sizeToWidth[size],
  },
  maxHeight: "100%",
  overflowY: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  ...sx,
});

export default function Modal({
  open,
  onClose,
  children,
  title,
  size = "medium",
  hasCloseButton = true,
  sx = {},
}: {
  open: boolean;
  onClose?: (event?: {}, reason?: string) => void;
  children: ReactElement;
  title?: string | ReactElement;
  size?: "small" | "medium" | "large";
  hasCloseButton?: boolean;
  sx?: SxProps<Theme>;
}) {
  const handleClose = (event?: {}, reason?: string) => {
    typeof onClose === "function" && onClose(event, reason);
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
        <Box sx={style(size, sx)}>
          {hasCloseButton && (
            <IconButton
              color="primary"
              aria-label="close"
              size="small"
              onClick={handleClose}
              sx={{ position: "absolute", top: 6, right: 6 }}
            >
              <Close />
            </IconButton>
          )}
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
