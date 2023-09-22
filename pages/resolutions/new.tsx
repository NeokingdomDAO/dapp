import { NeokingdomToken } from "@contracts/typechain";
import { useContractsContext } from "contexts/ContractsContext";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useAccount } from "wagmi";

import { useEffect, useState } from "react";

import { Alert, CircularProgress } from "@mui/material";

import { fetcher } from "@lib/net";
import { getExecutionPayload } from "@lib/resolutions/common";

import NewResolution from "@components/NewResolution";

import useResolutionsAcl from "@hooks/useResolutionsAcl";

import { MonthlyRewardsUserData } from "../../types";

NewResolutionPage.title = "New resolution";
NewResolutionPage.requireLogin = false;
NewResolutionPage.checkMismatch = true;

const MONTHLY_REWARDS_TEMPLATE = "monthlyRewards";

export default function NewResolutionPage() {
  const { acl, isLoading } = useResolutionsAcl();
  const { isConnected } = useAccount();
  const router = useRouter();
  const isMonthlyRewards = router.query?.template === MONTHLY_REWARDS_TEMPLATE;
  const { data: monthlyRewardsData, isLoading: isLoadingLastMonthRewards } = useSWR(
    isMonthlyRewards ? "/api/monthly_reward" : null,
    fetcher,
  );
  const { neokingdomTokenContract } = useContractsContext();

  const [executionPayload, setExecutionPayload] = useState<MonthlyRewardsUserData[] | null>(null);

  useEffect(() => {
    if (monthlyRewardsData && neokingdomTokenContract) {
      const getFn = async () => {
        const payload = await getExecutionPayload(neokingdomTokenContract as NeokingdomToken, monthlyRewardsData);
        setExecutionPayload(payload);
      };
      getFn();
    }
  }, [monthlyRewardsData, neokingdomTokenContract]);

  if (!isConnected) {
    return <Alert severity="warning">Please connect your wallet first</Alert>;
  }

  if (isLoading || isLoadingLastMonthRewards || (isMonthlyRewards && !executionPayload)) {
    return <CircularProgress />;
  }

  return acl?.canCreate ? (
    <NewResolution executionPayload={executionPayload} monthlyRewardsResolutionData={monthlyRewardsData?.resolution} />
  ) : (
    <Alert severity="error">You don&apos;t have permission to create a resolution</Alert>
  );
}
