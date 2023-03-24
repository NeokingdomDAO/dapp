import { EnqueueSnackbar, SnackbarKey, SnackbarMessage, useSnackbar as useNotistackSnackbar } from "notistack";

export function useSnackbar() {
  const { enqueueSnackbar, closeSnackbar, ...snackbar } = useNotistackSnackbar();
  const enhancedSnackbar: EnqueueSnackbar = (message: SnackbarMessage, options?: any) => {
    const key: SnackbarKey = enqueueSnackbar(message, {
      ...options,
      SnackbarProps: {
        onClick: () => closeSnackbar(key),
      },
    });
    return key;
  };

  return {
    enqueueSnackbar: enhancedSnackbar,
    ...snackbar,
  };
}
