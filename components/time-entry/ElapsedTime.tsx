import { Box, CircularProgress, Stack, SxProps, Theme, Typography } from "@mui/material";

function getElapsedDetails(seconds: number, hideSeconds: boolean) {
  const hours = Math.floor(seconds / 3600);
  const minutes = hideSeconds ? Math.ceil((seconds - hours * 3600) / 60) : Math.floor((seconds - hours * 3600) / 60);
  const remainingSeconds = seconds - hours * 3600 - minutes * 60;

  return {
    hours,
    minutes,
    seconds: remainingSeconds,
  };
}

export default function ElapsedTime({
  elapsedTime,
  withLabels = false,
  hideSeconds = false,
  size = "medium",
  minified = false,
  label,
  withBorders = false,
  isLoading = false,
  sx = {},
}: {
  label?: string;
  elapsedTime: number;
  withLabels?: boolean;
  hideSeconds?: boolean;
  size?: "small" | "medium";
  minified?: boolean;
  withBorders?: boolean;
  isLoading?: boolean;
  sx?: SxProps<Theme>;
}) {
  const { hours, minutes, seconds } = getElapsedDetails(elapsedTime, hideSeconds);

  const hoursToDisplay = hours < 10 ? `0${hours}` : hours;
  const minutesToDisplay = minutes < 10 ? `0${minutes}` : minutes;
  const secondsToDisplay = seconds < 10 ? `0${seconds}` : seconds;

  if (minified) {
    return (
      <Box sx={{ fontWeight: "bold" }} component="span">
        {[hoursToDisplay, minutesToDisplay].join(":")}h
      </Box>
    );
  }

  return (
    <Box sx={sx}>
      {label && (
        <Typography variant={size === "medium" ? "h5" : "body1"} sx={{ fontWeight: "bold", mb: 1 }}>
          {label}
        </Typography>
      )}
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Stack direction="row" alignItems="center" justifyContent={{ xs: "center", md: "flex-start" }}>
          <Box
            sx={{
              p: size === "small" ? 0.6 : 1,
              bgcolor: "background.paper",
              borderRadius: 2,
              width: withLabels ? "auto" : 50,
              textAlign: "center",
              ...(withBorders && { border: "1px solid", borderColor: "divider" }),
            }}
          >
            <Typography variant={size === "medium" ? "h5" : "body1"}>
              {hoursToDisplay}
              {withLabels ? "h" : ""}
            </Typography>
          </Box>
          <Typography
            variant={size === "medium" ? "h5" : "body1"}
            sx={{ position: "relative", top: -2, margin: "0 4px" }}
          >
            :
          </Typography>
          <Box
            sx={{
              p: size === "small" ? 0.6 : 1,
              bgcolor: "background.paper",
              borderRadius: 2,
              width: withLabels ? "auto" : 50,
              textAlign: "center",
              ...(withBorders && { border: "1px solid", borderColor: "divider" }),
            }}
          >
            <Typography variant={size === "medium" ? "h5" : "body1"}>
              {minutesToDisplay}
              {withLabels ? "m" : ""}
            </Typography>
          </Box>
          {!hideSeconds && (
            <>
              <Typography
                variant={size === "medium" ? "h5" : "body1"}
                sx={{ position: "relative", top: -2, margin: "0 4px" }}
              >
                :
              </Typography>
              <Box
                sx={{
                  p: 1,
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  width: withLabels ? "auto" : 50,
                  textAlign: "center",
                  ...(withBorders && { border: "1px solid", borderColor: "divider" }),
                }}
              >
                <Typography variant={size === "medium" ? "h5" : "body1"}>
                  {secondsToDisplay}
                  {withLabels ? "s" : ""}
                </Typography>
              </Box>
            </>
          )}
        </Stack>
      )}
    </Box>
  );
}
