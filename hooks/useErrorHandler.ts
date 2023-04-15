import { ActionResponse } from "../store/projectTaskStore";
import { useSnackbar } from "./useSnackbar";
import useUser from "./useUser";

export default function useErrorHandler() {
  const { enqueueSnackbar } = useSnackbar();
  const { mutateUser } = useUser();

  const handleActionResponse = (response: ActionResponse) => {
    if (!response) return;
    const { alert, error } = response;
    if (alert) {
      enqueueSnackbar(alert.message, { variant: alert.variant });
    }
    if (error) {
      if (error.status === 401) {
        return mutateUser();
      }
      enqueueSnackbar(error.message, { variant: "error" });
      return error;
    }
    return response;
  };

  const handleError =
    <T extends Function>(func: T) =>
    async (...args: any[]) => {
      return handleActionResponse(await func(...args));
    };

  return {
    handleError,
  };
}
