import { useAccount } from "wagmi";

import { Alert, CircularProgress } from "@mui/material";

import { fetcherWithParams } from "@graphql/client";
import { getResolutionQuery } from "@graphql/queries/subgraph/get-resolution-query";

import { getEnhancedResolutionMapper } from "@lib/resolutions/common";

import useResolutionsAcl from "@hooks/useResolutionsAcl";

import EditResolution from "../../../components/EditResolution";
import { GetResolutionQuery } from "../../../gql/graphql";
import { ResolutionEntity, ResolutionEntityEnhanced } from "../../../types";

EditResolutionPage.title = "Edit resolution";
EditResolutionPage.requireLogin = false;
EditResolutionPage.checkMismatch = true;

export const getServerSideProps = async ({ params, res }: any) => {
  // TODO Andrea: fix fetcherWithParams typing
  const data = await fetcherWithParams<GetResolutionQuery>([getResolutionQuery, params]);

  if (!data.resolution) {
    res.statusCode = 404;

    return {
      props: {
        resolution: null,
      },
    };
  }

  const enhancedResolution: ResolutionEntityEnhanced = getEnhancedResolutionMapper(+new Date())(data.resolution);

  if (enhancedResolution.state !== "pre-draft") {
    return {
      redirect: {
        permanent: true,
        destination: `/resolutions/${params.id}`,
      },
    };
  }

  return {
    props: {
      resolution: data.resolution,
    },
  };
};

export default function EditResolutionPage({ resolution }: { resolution: ResolutionEntity | null }) {
  const { acl, isLoading } = useResolutionsAcl();
  const { isConnected } = useAccount();

  if (!resolution) {
    return <Alert severity="warning">Resolution not found</Alert>;
  }

  if (!isConnected) {
    return <Alert severity="warning">Please connect your wallet first</Alert>;
  }

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!acl?.canUpdate || !acl?.canApprove) {
    return (
      <Alert severity="error">
        You don&apos;t have a managing role, you can&apos;t update nor approve this resolution
      </Alert>
    );
  }

  return <EditResolution resolution={resolution} />;
}
