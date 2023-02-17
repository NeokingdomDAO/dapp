import { useRouter } from "next/router";
import useSWR from "swr";

import { Alert, CircularProgress, Typography } from "@mui/material";

import { fetcherWithParams } from "@graphql/client";
import { getResolutionQuery } from "@graphql/queries/get-resolution.query";

export default function ResolutionView() {
  const router = useRouter();

  const { data: resolutionData, isLoading: isLoadingResolution } = useSWR(
    [getResolutionQuery, { id: router.query.id }],
    fetcherWithParams,
  );

  if (isLoadingResolution) {
    return <CircularProgress />;
  }

  if (resolutionData && !resolutionData.resolution) {
    return <Alert severity="warning">Resolution not found</Alert>;
  }

  const resolution = resolutionData.resolution;

  return (
    <>
      <Typography variant="h3">{resolution.title}</Typography>
    </>
  );
}
