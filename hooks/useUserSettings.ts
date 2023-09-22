import { shallow } from "zustand/shallow";

import { useEffect } from "react";

import userUserSettingsStore from "@store/userSettings";

import useUser from "./useUser";

export default function useUserSettings() {
  const { user } = useUser();

  const settingsStore = userUserSettingsStore(
    (state) => ({
      openProjects: state.openProjects,
      openTasks: state.openTasks,
      setOpenProjects: state.setOpenProjects,
      setOpenTasks: state.setOpenTasks,
    }),
    shallow,
  );

  useEffect(() => {
    if (user?.id) {
      const changePersistanceId = async () => {
        userUserSettingsStore.persist.setOptions({ name: `user-settings-${user?.id}` });
        await userUserSettingsStore.persist.rehydrate();
      };
      changePersistanceId();
    }
  }, [user?.id]);

  return settingsStore;
}
