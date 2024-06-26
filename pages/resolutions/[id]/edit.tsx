import { getResolution } from "drizzle/db";
import { useAccount } from "wagmi";

import { Alert, CircularProgress } from "@mui/material";

import { getLegacyResolutionQuery } from "@graphql/subgraph/queries/get-legacy-resolution-query";
import { getResolutionQuery } from "@graphql/subgraph/queries/get-resolution-query";
import {
  fetcherGraphqlPublic,
  isLegacyClientEnabled,
  legacyFetcherGraphqlPublic,
} from "@graphql/subgraph/subgraph-client";

import { getEnhancedResolutionMapper } from "@lib/resolutions/common";

import useResolutionsAcl from "@hooks/useResolutionsAcl";

import EditResolution from "../../../components/EditResolution";
import { ResolutionEntityEnhanced } from "../../../types";

EditResolutionPage.title = "Edit resolution";
EditResolutionPage.requireLogin = false;
EditResolutionPage.checkMismatch = true;

export const getServerSideProps = async ({ params, res }: any) => {
  const data = await fetcherGraphqlPublic([getResolutionQuery, { id: params.id as string }]);
  const legacyGraphQlResolutionData: any =
    data?.resolution === null && isLegacyClientEnabled
      ? await legacyFetcherGraphqlPublic([getLegacyResolutionQuery, { id: params.id as string }])
      : null;

  if (!data.resolution && !legacyGraphQlResolutionData?.resolution) {
    res.statusCode = 404;

    return {
      props: {
        resolution: null,
      },
    };
  }

  const dbResolution = await getResolution(
    (data.resolution?.ipfsDataURI || legacyGraphQlResolutionData.resolution?.ipfsDataURI) as string,
  );
  const enhancedResolution: ResolutionEntityEnhanced = getEnhancedResolutionMapper(+new Date())({
    ...(data.resolution || legacyGraphQlResolutionData.resolution),
    title: dbResolution?.title,
    content: dbResolution?.content,
    isRewards: dbResolution?.isRewards,
  });

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
      resolution: {
        ...(data.resolution || legacyGraphQlResolutionData.resolution),
        title: dbResolution?.title,
        content: dbResolution?.content,
      },
    },
  };
};

export default function EditResolutionPage({ resolution }: { resolution: ResolutionEntityEnhanced | null }) {
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
