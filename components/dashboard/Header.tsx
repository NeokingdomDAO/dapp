import { useAccount } from "wagmi";

import { InfoOutlined } from "@mui/icons-material";
import { Chip, IconButton, Paper, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import Box from "@mui/material/Box";

import { getCurrentMonth } from "@lib/resolutions/common";

import User from "@components/User";

import useCurrentTasks from "@hooks/useCurrentTasks";
import useShareholderStatus from "@hooks/useShareholderStatus";

export default function Header() {
  const { address } = useAccount();
  const { isLoading, totalTime } = useCurrentTasks();

  const { getShareholderStatus } = useShareholderStatus();

  return (
    <>
      <Box sx={{ mr: 2 }}>
        <Typography variant="h3" sx={{ pb: 2 }}>
          Welcome,
        </Typography>
        <User address={address as string} shouldMarkCurrentUser={false} shortAddress />
        <Stack sx={{ pt: 2 }} spacing={1} direction="row">
          {getShareholderStatus(address as string).map((status) => (
            <Chip key={status} size="small" label={status} />
          ))}
        </Stack>
      </Box>
      <Paper sx={{ textAlign: "center", p: 2, ml: "auto" }}>
        {isLoading ? (
          <Box sx={{ width: 120 }}>
            <Typography variant="caption">
              <Skeleton />
            </Typography>
            <Typography variant="h4">
              <Skeleton />
            </Typography>
            <Typography variant="caption">
              <Skeleton />
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="caption">You worked</Typography>
            <Typography variant="h4">{totalTime}</Typography>
            <Typography variant="caption">in {getCurrentMonth()}, so far</Typography>
            <Tooltip title="Once approved, the corresponding tokens will be minted" arrow>
              <IconButton color="primary" aria-label="info" size="small">
                <InfoOutlined />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Paper>
    </>
  );
}
