import { useAccount } from "wagmi";

import { ReactElement } from "react";

import { Box, Card, CardActions, CardContent, Chip, Divider, Stack, Typography } from "@mui/material";

import { isSameAddress } from "@lib/utils";

import User from "@components/User";

export default function UserCard({
  address,
  power,
  statuses,
  cta,
}: {
  address: string;
  power: string;
  statuses: string[];
  cta?: ReactElement;
}) {
  const { address: connectedAddress } = useAccount();

  const cardProps = isSameAddress(connectedAddress as string, address)
    ? {
        variant: "elevation" as "elevation",
        elevation: 6,
      }
    : { variant: "outlined" as "outlined" };

  return (
    <Card {...cardProps}>
      <CardContent sx={{ pt: 3, pb: 3 }}>
        <User address={address} />
        <Stack
          direction="row"
          justifyContent="center"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
          sx={{ textAlign: "center", mt: 2 }}
        >
          <Box>
            <Typography variant="body2">Voting power</Typography>
            <Typography variant="caption">{power}%</Typography>
          </Box>
        </Stack>
      </CardContent>
      <CardActions sx={{ borderTop: (t) => `1px solid ${t.palette.divider}`, display: "flex", width: "100%" }}>
        {statuses.map((status) => (
          <Chip key={status} size="small" label={status} />
        ))}
        <Box ml="auto !important">{cta}</Box>
      </CardActions>
    </Card>
  );
}
