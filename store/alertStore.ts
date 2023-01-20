import { create } from "zustand";

interface Alert {
  open: boolean;
  message: string;
  severity: string;
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
