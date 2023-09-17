import { Box, Stack, Typography } from "@mui/material";

function getElapsedDetails(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
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
}: {
  elapsedTime: number;
  withLabels?: boolean;
  hideSeconds?: boolean;
  size?: "small" | "medium";
}) {
  const { hours, minutes, seconds } = getElapsedDetails(elapsedTime);

  const hoursToDisplay = hours < 10 ? `0${hours}` : hours;
  const minutesToDisplay = minutes < 10 ? `0${minutes}` : minutes;
  const secondsToDisplay = seconds < 10 ? `0${seconds}` : seconds;

  return (
    <Stack direction="row" alignItems="center">
      <Box
        sx={{
          p: 1,
          bgcolor: "background.paper",
          borderRadius: 2,
          width: withLabels ? "auto" : 50,
          textAlign: "center",
        }}
      >
        <Typography variant={size === "medium" ? "h5" : "body1"}>
          {hoursToDisplay}
          {withLabels ? "h" : ""}
        </Typography>
      </Box>
      <Typography variant={size === "medium" ? "h5" : "body1"} sx={{ position: "relative", top: -2, margin: "0 4px" }}>
        :
      </Typography>
      <Box
        sx={{
          p: 1,
          bgcolor: "background.paper",
          borderRadius: 2,
          width: withLabels ? "auto" : 50,
          textAlign: "center",
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
  );
}
