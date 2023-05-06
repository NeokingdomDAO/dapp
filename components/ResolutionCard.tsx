import NextLink from "next/link";

import * as React from "react";
import { useState } from "react";

import { Alert, Box, Button, Link, Stack, SxProps } from "@mui/material";
import Card, { CardProps } from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";

import ResolutionInfo from "@components/ResolutionInfo";
import User from "@components/User";

import useResolutionsAcl from "../hooks/useResolutionsAcl";
import { RESOLUTION_STATES } from "../lib/resolutions/common";
import { ResolutionEntityEnhanced } from "../types";
import Countdown from "./Countdown";
import Modal from "./Modal";
import VotingWidget from "./VotingWidget";

export default function ResolutionCard({
  resolution,
  sx = {},
}: {
  resolution: ResolutionEntityEnhanced;
  sx?: SxProps;
}) {
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const { acl } = useResolutionsAcl();

  const handleVote = () => {
    setVoteModalOpen(true);
  };

  const canEdit = resolution.state === RESOLUTION_STATES.PRE_DRAFT && acl.canUpdate;

  const cardProps: Partial<CardProps> =
    resolution.state === RESOLUTION_STATES.VOTING
      ? {
          variant: "elevation",
          elevation: 12,
        }
      : { variant: "outlined" };

  return (
    <Card
      {...cardProps}
      sx={{
        height: "100%",
        position: "relative",
        pb: 8,
        opacity: resolution.state === RESOLUTION_STATES.REJECTED ? "0.5" : 1,
        ...sx,
      }}
    >
      <Modal open={voteModalOpen} onClose={() => setVoteModalOpen(false)} title={resolution.title}>
        <VotingWidget resolution={resolution} />
      </Modal>
      <CardHeader
        title={
          <Link
            component={NextLink}
            href={canEdit ? `/resolutions/${resolution.id}/edit` : `/resolutions/${resolution.id}`}
          >
            #{resolution.id} {resolution.title}
          </Link>
        }
        titleTypographyProps={{
          variant: "h6",
          lineHeight: "1.5rem",
        }}
        sx={{ pb: 0 }}
      />
      <CardContent sx={{ pt: 0, pb: 0 }}>
        <Typography variant="body2" sx={{ pt: 1, pb: 0.5 }}>
          Created on {resolution.createdAt} by
        </Typography>
        <User address={resolution.createBy} />
        <Box sx={{ mt: 2 }}>
          {resolution.state === RESOLUTION_STATES.VOTING && !resolution.isLegacy && (
            <Alert
              severity="info"
              action={
                <Button variant="contained" color="primary" size="small" onClick={handleVote}>
                  Vote
                </Button>
              }
            >
              <Countdown
                targetDate={resolution.resolutionTypeInfo.votingEnds as Date}
                prefixLabel="Voting ends in"
                inline
              />
            </Alert>
          )}
          {resolution.state === RESOLUTION_STATES.VOTING && resolution.isLegacy && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This resolution can be voted on in{" "}
              <Link target="_blank" href={`https://dao.legacy.neokingdom.org/#/resolutions/${resolution.id}`}>
                the old dapp
              </Link>
            </Alert>
          )}
          {resolution.state === RESOLUTION_STATES.ENDED && (
            <Alert severity={resolution.hasQuorum ? "success" : "error"}>
              {resolution.hasQuorum ? (
                <span>
                  THE RESOLUTION OF SHAREHOLDERS <b>HAS BEEN</b> ADOPTED on {resolution.resolutionTypeInfo.votingEndsAt}
                </span>
              ) : (
                <span>
                  THE RESOLUTION OF SHAREHOLDERS <b>HAS NOT BEEN</b> ADOPTED. Voting ended on{" "}
                  {resolution.resolutionTypeInfo.votingEndsAt}
                </span>
              )}
            </Alert>
          )}
          {resolution.state === RESOLUTION_STATES.REJECTED && (
            <Alert severity="error">This resolution has been rejected</Alert>
          )}
          {resolution.state === RESOLUTION_STATES.PRE_DRAFT && (
            <Alert severity="info">Resolution is in draft and awaiting approval</Alert>
          )}
          {resolution.state === RESOLUTION_STATES.NOTICE && (
            <Alert severity="info">
              <Countdown
                targetDate={resolution.resolutionTypeInfo.noticePeriodEnds as Date}
                prefixLabel="Voting starts in"
                inline
              />
            </Alert>
          )}
        </Box>
      </CardContent>
      <CardActions
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          bgcolor: "grey.100",
          ['[data-mui-color-scheme="dark"] &']: { bgcolor: "grey.900" },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
          <ResolutionInfo chipSize="small" resolution={resolution} hideState />
          <Button
            variant="outlined"
            color="primary"
            size="small"
            href={canEdit ? `/resolutions/${resolution.id}/edit` : `/resolutions/${resolution.id}`}
            LinkComponent={NextLink}
          >
            {canEdit ? "Edit" : "View"}
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
}
