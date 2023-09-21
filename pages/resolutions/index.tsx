import Link from "next/link";
import { useAccount } from "wagmi";

import { useMemo, useState } from "react";

import { Box, Button, CircularProgress, FormControlLabel, Grid, Stack, Switch } from "@mui/material";

import { getEnhancedResolutions } from "@lib/resolutions/common";
import { RESOLUTION_STATES } from "@lib/resolutions/common";

import ResolutionCard from "@components/ResolutionCard";

import useGetResolutions from "@hooks/useGetResolutions";
import useResolutionsAcl from "@hooks/useResolutionsAcl";
import useTimestamp from "@hooks/useTimestamp";

import { ResolutionEntityEnhanced } from "../../types";

Resolutions.title = "Resolutions";
Resolutions.checkMismatch = true;

export default function Resolutions() {
  const { isConnected } = useAccount();
  const { acl, isLoading: isLoadingAcl } = useResolutionsAcl();
  const [includeRejected, setIncludeRejected] = useState(false);
  const { currentTimestamp } = useTimestamp();
  const { resolutions, isLoading } = useGetResolutions();

  const enhancedResolutions: ResolutionEntityEnhanced[] = useMemo(() => {
    if ((isLoading || isLoadingAcl) && resolutions.length === 0) {
      return [];
    }
    return getEnhancedResolutions(resolutions, +currentTimestamp, acl);
  }, [resolutions, currentTimestamp, acl, isLoading, isLoadingAcl]);

  const filteredResolutions = includeRejected
    ? enhancedResolutions
    : enhancedResolutions.filter((resolution) => resolution.state !== RESOLUTION_STATES.REJECTED);

  const hasRejected =
    enhancedResolutions.filter((resolution) => resolution.state === RESOLUTION_STATES.REJECTED).length > 0;

  return (
    <>
      <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
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
      {(isLoading || isLoadingAcl) && resolutions?.length === 0 && <CircularProgress />}
      <Grid container spacing={3}>
        {filteredResolutions.map((resolution) => (
          <Grid item xs={12} md={6} lg={4} key={resolution.id}>
            <ResolutionCard resolution={resolution} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
