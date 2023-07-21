import { useAccount } from "wagmi";

import { useMemo } from "react";

import { HowToVote, ThumbDown, ThumbUpSharp } from "@mui/icons-material";
import { Alert, Box, Card, CardContent, Chip, Divider, Stack, Tooltip, Typography } from "@mui/material";

import { isSameAddress } from "@lib/utils";

import User from "@components/User";

import { ResolutionVoter } from "../../types";

export default function UserCard({
  user,
  percentageOfAllVotes,
  isExcludedFromVoting,
}: {
  user: ResolutionVoter;
  percentageOfAllVotes: string;
  isExcludedFromVoting: boolean;
}) {
  const { address } = useAccount();

  const poaTooltip = useMemo(() => {
    if (user.delegating) {
      return (
        <span>
          Delegated to <User address={user.delegating.address} isInline inlineVariant="caption" />
        </span>
      );
    }
    if (user.beingDelegatedBy.length > 0) {
      return (
        <span>
          Being delegated by{" "}
          {user.beingDelegatedBy.map((u, index) => (
            <span key={u.address}>
              <User address={u.address} isInline inlineVariant="caption" />
              {index < user.beingDelegatedBy.length - 2 && <span>, </span>}
              {index < user.beingDelegatedBy.length - 1 && index >= user.beingDelegatedBy.length - 2 && (
                <span> and </span>
              )}
            </span>
          ))}
        </span>
      );
    }
    return "";
  }, [user]);

  const cardProps = isSameAddress(address as string, user.address)
    ? {
        variant: "elevation" as "elevation",
        elevation: 6,
      }
    : { variant: "outlined" as "outlined" };

  return (
    <Card
      {...cardProps}
      sx={{
        "@media print": { breakInside: "avoid", boxShadow: "none", border: (t) => `1px solid ${t.palette.divider}` },
        position: "relative",
      }}
    >
      <CardContent sx={{ pt: 3, pb: 3 }}>
        {!isExcludedFromVoting && (
          <Box sx={{ position: "absolute", top: 10, right: 10 }}>
            {user.hasVoted ? (
              <Chip
                icon={user.hasVotedYes ? <ThumbUpSharp /> : <ThumbDown />}
                label={user.hasVotedYes ? "Yes" : "No"}
                color={user.hasVotedYes ? "success" : "error"}
                size="small"
                variant="outlined"
                sx={{ pl: 0.6 }}
              />
            ) : (
              <Chip
                icon={<HowToVote fontSize="small" />}
                label="Abstain"
                size="small"
                color="default"
                variant="outlined"
                sx={{ pl: 0.6 }}
              />
            )}
          </Box>
        )}
        <User address={user.address} />
        {isExcludedFromVoting ? (
          <Alert sx={{ mt: 2 }} severity="info">
            this contributor is excluded from voting this resolution
          </Alert>
        ) : (
          <Stack
            direction="row"
            justifyContent="center"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={2}
            sx={{ textAlign: "center", mt: 2 }}
          >
            <Box>
              <Typography variant="body2">Tokens (# Votes)</Typography>
              <Typography variant="caption">{user.votingPowerInt.toLocaleString()}</Typography>
            </Box>
            <Box>
              <Typography variant="body2">% of all votes</Typography>
              <Typography variant="caption">{Number(percentageOfAllVotes)}</Typography>
            </Box>
            <Box>
              <Typography variant="body2">
                <Tooltip title="Power of Attorney" placement="top" arrow>
                  <Box
                    component="span"
                    sx={{ cursor: "help", borderBottom: "1px dashed", "@media print": { borderBottom: "none" } }}
                  >
                    PoA
                  </Box>
                </Tooltip>{" "}
                was used
              </Typography>
              <Typography variant="caption">
                {user.usedPoa ? (
                  <Tooltip title={poaTooltip} arrow placement="top">
                    <Chip sx={{ cursor: "help" }} label="Yes" size="small" color="info" variant="outlined" />
                  </Tooltip>
                ) : (
                  <span>No</span>
                )}
              </Typography>
            </Box>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
