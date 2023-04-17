import { forwardRef } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  useTheme,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

import useDialogStore from "@store/dialogStore";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TrackingDialog() {
  const theme = useTheme();
  const dialog = useDialogStore();

  const handleCancel = () => {
    dialog.onCancel && dialog.onCancel();
    dialog.closeDialog();
  };

  const handleConfirm = () => {
    dialog.onConfirm && dialog.onConfirm();
    dialog.closeDialog();
  };

  return (
    <Dialog
      open={dialog.open}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => dialog.closeDialog()}
      aria-describedby={dialog.id}
      slotProps={{
        backdrop: {
          style: {
            backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(4px)",
          },
        },
      }}
    >
      <DialogTitle>{dialog.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id={dialog.id}>{dialog.message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {dialog.onCancel && (
          <Button onClick={handleCancel} variant="text">
            {dialog.cancelBtnText}
          </Button>
        )}
        {dialog.onConfirm && (
          <Button onClick={handleConfirm} variant="contained">
            {dialog.confirmBtnText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
