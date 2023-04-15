import { useDisconnect } from "wagmi";
import { shallow } from "zustand/shallow";

import { useCallback } from "react";

import useLoginModalStore from "@store/loginModal";

import { useSnackbar } from "./useSnackbar";
import useUser from "./useUser";

export default function useLogout() {
  const { disconnect } = useDisconnect();
  const { mutateUser } = useUser();

  const { enqueueSnackbar } = useSnackbar();

  const { setIsReadyToSign } = useLoginModalStore(
    (state) => ({
      setIsReadyToSign: state.setIsReadyToSign,
    }),
    shallow,
  );

  const logout = useCallback(async (fromDisconnect: boolean = false) => {
    try {
      if (!fromDisconnect) {
        disconnect();
      }
      const res = await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.status === 200) {
        mutateUser();
      } else {
        enqueueSnackbar("Logout failed, please try again later", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Network error, please try again later", { variant: "error" });
    }
    setIsReadyToSign(false);
  }, []); // eslint-disable-line

  return { logout };
}
