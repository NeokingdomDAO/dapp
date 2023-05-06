import { ReactElement, forwardRef } from "react";

import { Button, Slide, useTheme } from "@mui/material";
import MUIDialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { TransitionProps } from "@mui/material/transitions";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type DialogProps = {
  open: boolean;
  handleApprove: () => void;
  handleClose: () => void;
  descriptionId: string;
  title?: string;
  children: ReactElement;
};

export default function Dialog({
  open,
  handleApprove,
  handleClose,
  descriptionId,
  title = "Are you sure?",
  children,
}: DialogProps) {
  const theme = useTheme();

  return (
    <MUIDialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby={descriptionId}
      slotProps={{
        backdrop: {
          style: {
            backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(4px)",
          },
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id={descriptionId}>{children}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="text">
          Discard
        </Button>
        <Button onClick={handleApprove} variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </MUIDialog>
  );
}
