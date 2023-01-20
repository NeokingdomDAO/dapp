import { create } from "zustand";
import { AlertColor } from "@mui/material/Alert";
interface Alert {
  open: boolean;
  message: string;
  severity: AlertColor;
  openAlert: (alert: any) => void;
  closeAlert: () => void;
}

const useAlertStore = create<Alert>((set) => ({
  open: false,
  message: "",
  severity: "error",
  openAlert: (alert = {}) => set({ open: true, ...alert }),
  closeAlert: () => set({ open: false, message: "", severity: "error" }),
}));

export default useAlertStore;
