import { useRouter } from "next/router";
import useSWR from "swr";
import { useAccount } from "wagmi";

import { useEffect, useState } from "react";

import { Alert, CircularProgress } from "@mui/material";

import { fetcher } from "@lib/net";
import { getExecutionPayload } from "@lib/resolutions/common";

import NewResolution from "@components/NewResolution";

import useResolutionsAcl from "@hooks/useResolutionsAcl";

import { useContractsContext } from "../../contexts/ContractsContext";
import { TelediskoToken } from "../../contracts/typechain";
import { MonthlyRewardsUserData } from "../../types";

NewResolutionPage.title = "New resolution";
NewResolutionPage.requireLogin = true;

const MONTHLY_REWARDS_TEMPLATE = "monthlyRewards";

export default function NewResolutionPage() {
  const { acl, isLoading } = useResolutionsAcl();
  const { isConnected } = useAccount();
  const router = useRouter();
  const isMonthlyRewards = router.query?.template === MONTHLY_REWARDS_TEMPLATE;
  const { data: monthlyRewardsData, isLoading: isLoadingLastMonthRewards } = useSWR(
    isMonthlyRewards ? process.env.NEXT_PUBLIC_LAST_MONTH_REWARDS_ENDPOINT : null,
    fetcher,
  );
  const { tokenContract } = useContractsContext();

  const [executionPayload, setExecutionPayload] = useState<MonthlyRewardsUserData[] | null>(null);

  useEffect(() => {
    if (monthlyRewardsData && tokenContract) {
      const getFn = async () => {
        const payload = await getExecutionPayload(tokenContract as TelediskoToken, monthlyRewardsData);
        setExecutionPayload(payload);
      };
      getFn();
    }
  }, [monthlyRewardsData, tokenContract]);

  if (!isConnected) {
    return <Alert severity="warning">Please connect your wallet first</Alert>;
  }

  if (isLoading || (isMonthlyRewards && !executionPayload)) {
    return <CircularProgress />;
  }

  return acl?.canCreate ? (
    <NewResolution executionPayload={executionPayload} monthlyRewardsResolutionData={monthlyRewardsData?.resolution} />
  ) : (
    <Alert severity="error">You don&apos;t have permission to create a resolution</Alert>
  );
}
