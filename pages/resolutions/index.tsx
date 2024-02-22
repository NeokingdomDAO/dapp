import Link from "next/link";
import { useAccount } from "wagmi";

import { useMemo, useState } from "react";

import { Box, Button, CircularProgress, FormControlLabel, Grid, Stack, Switch, Typography } from "@mui/material";

import { getEnhancedResolutions } from "@lib/resolutions/common";
import { RESOLUTION_STATES } from "@lib/resolutions/common";
import { isSameAddress } from "@lib/utils";

import ResolutionCard from "@components/ResolutionCard";
import Section from "@components/Section";

import useGetResolutions from "@hooks/useGetResolutions";
import useResolutionsAcl from "@hooks/useResolutionsAcl";
import useTimestamp from "@hooks/useTimestamp";
import useUser from "@hooks/useUser";

Resolutions.title = "Resolutions";
Resolutions.checkMismatch = true;
Resolutions.fullWidth = true;

export default function Resolutions() {
  const { isConnected, address } = useAccount();
  const { acl, isLoading: isLoadingAcl } = useResolutionsAcl();
  const [includeRejected, setIncludeRejected] = useState(false);
  const { currentTimestamp } = useTimestamp();
  const { user } = useUser();
  const { resolutions, isLoading, error } = useGetResolutions();

  const enhancedResolutions = useMemo(() => {
    if ((isLoading || isLoadingAcl) && resolutions.length === 0) {
      return [];
    }
    return getEnhancedResolutions(resolutions, +currentTimestamp, acl);
  }, [resolutions, currentTimestamp, acl, isLoading, isLoadingAcl]);

  const filteredResolutions = includeRejected
    ? enhancedResolutions
    : enhancedResolutions.filter((resolution) => resolution.state !== RESOLUTION_STATES.REJECTED);

  const [activeResolutions, inactiveResolutions] = useMemo(() => {
    const active = filteredResolutions.filter((resolution) => {
      const votingUser = address
        ? resolution.votingStatus.votersHaveVoted.find((voter) => isSameAddress(voter.address, address))
        : null;
      return resolution.state === RESOLUTION_STATES.VOTING && !votingUser && user?.isLoggedIn;
    });
    const inactive = filteredResolutions.filter((resolution) => {
      const votingUser = address
        ? resolution.votingStatus.votersHaveVoted.find((voter) => isSameAddress(voter.address, address))
        : null;
      return resolution.state !== RESOLUTION_STATES.VOTING || !!votingUser || !user?.isLoggedIn;
    });
    return [active, inactive];
  }, [filteredResolutions, address]);

  const hasRejected =
    enhancedResolutions.filter((resolution) => resolution.state === RESOLUTION_STATES.REJECTED).length > 0;

  if (error) {
    return null;
  }

  return (
    <>
      <Section sx={{ pt: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isConnected && acl.isContributor && (
            <Stack direction="row" spacing={2}>
              <Button component={Link} href="/resolutions/new" variant="outlined">
                Create new Resolution
              </Button>
              <Button component={Link} href="/resolutions/new?template=monthlyRewards" variant="outlined">
                Monthly Rewards
              </Button>
            </Stack>
          )}
          {hasRejected && (
            <FormControlLabel
              sx={{ ml: "auto" }}
              control={<Switch checked={includeRejected} onChange={() => setIncludeRejected((old) => !old)} />}
              label="Include rejected"
            />
          )}
        </Box>
      </Section>
      {activeResolutions?.length > 0 && (
        <Section inverse>
          <>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Resolutions you need to vote
            </Typography>
            <Grid container spacing={3}>
              {activeResolutions.map((resolution) => (
                <Grid item xs={12} md={6} lg={4} key={resolution.id}>
                  <ResolutionCard resolution={resolution} />
                </Grid>
              ))}
            </Grid>
          </>
        </Section>
      )}
      <Section inverse={activeResolutions?.length === 0}>
        <>
          {activeResolutions?.length > 0 && (
            <Typography variant="h5" sx={{ mb: 2 }}>
              Other resolutions
            </Typography>
          )}
          {(isLoading || isLoadingAcl) && resolutions?.length === 0 && <CircularProgress />}
          <Grid container spacing={3}>
            {inactiveResolutions.map((resolution) => (
              <Grid item xs={12} md={6} lg={4} key={resolution.id}>
                <ResolutionCard resolution={resolution} />
              </Grid>
            ))}
          </Grid>
        </>
      </Section>
    </>
  );
}
