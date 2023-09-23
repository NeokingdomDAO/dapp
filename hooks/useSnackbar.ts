import { EnqueueSnackbar, SnackbarKey, SnackbarMessage, useSnackbar as useNotistackSnackbar } from "notistack";

import { useCallback } from "react";

export function useSnackbar() {
  const { enqueueSnackbar, closeSnackbar, ...snackbar } = useNotistackSnackbar();
  const enhancedSnackbar: EnqueueSnackbar = useCallback((message: SnackbarMessage, options?: any) => {
    const key: SnackbarKey = enqueueSnackbar(message, {
      ...(options || {}),
      SnackbarProps: options?.persist
        ? {}
        : {
            onClick: () => closeSnackbar(key),
            style: {
              cursor: "pointer",
            },
          },
    });
    return key;
  }, []); // eslint-disable-line

  return {
    enqueueSnackbar: enhancedSnackbar,
    closeSnackbar,
    ...snackbar,
  };
}
