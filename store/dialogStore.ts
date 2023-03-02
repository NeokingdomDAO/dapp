import { create } from "zustand";

export type DialogState = {
  id?: string;
  open: boolean;
  title?: string;
  message?: string | React.ReactElement;
  cancelBtnText?: string;
  confirmBtnText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

type DialogStore = DialogState & {
  openDialog: (dialog: DialogState) => void;
  closeDialog: () => void;
};

const defaultState = {
  open: false,
  id: "confirm-dialog",
  title: "Are you sure?",
  cancelBtnText: "Cancel",
  confirmBtnText: "Confirm",
  onConfirm: () => null,
  onCancel: () => null,
};

const useDialogStore = create<DialogStore>((set) => ({
  ...defaultState,
  openDialog: (dialog: DialogState) => set(dialog),
  closeDialog: () => set(defaultState),
}));

export default useDialogStore;
