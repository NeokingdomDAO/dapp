import { Box, Stack, Typography } from "@mui/material";

export default function ElapsedTime({ hours, minutes, seconds }: { hours: number; minutes: number; seconds: number }) {
  const hoursToDisplay = hours < 10 ? `0${hours}` : hours;
  const minutesToDisplay = minutes < 10 ? `0${minutes}` : minutes;
  const secondsToDisplay = seconds < 10 ? `0${seconds}` : seconds;

  return (
    <Stack direction="row" alignItems="center">
      <Box sx={{ p: 1, bgcolor: "background.paper", borderRadius: 2, width: 50, textAlign: "center" }}>
        <Typography variant="h5">{hoursToDisplay}</Typography>
      </Box>
      <Typography variant="h5" sx={{ position: "relative", top: -2, margin: "0 4px" }}>
        :
      </Typography>
      <Box sx={{ p: 1, bgcolor: "background.paper", borderRadius: 2, width: 50, textAlign: "center" }}>
        <Typography variant="h5">{minutesToDisplay}</Typography>
      </Box>
      <Typography variant="h5" sx={{ position: "relative", top: -2, margin: "0 4px" }}>
        :
      </Typography>
      <Box sx={{ p: 1, bgcolor: "background.paper", borderRadius: 2, width: 50, textAlign: "center" }}>
        <Typography variant="h5">{secondsToDisplay}</Typography>
      </Box>
    </Stack>
  );
}
