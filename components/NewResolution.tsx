import Head from "next/head";
import { useRouter } from "next/router";
import { useStore } from "zustand";

import { useRef, useState } from "react";

import LoadingButton from "@mui/lab/LoadingButton";
import { Alert, Box, Divider, Typography } from "@mui/material";

import { useFeatureFlags } from "@lib/feature-flags/useFeatureFlags";
import { getPreviousMonth } from "@lib/resolutions/common";
import { TOKEN_SYMBOL, enhanceTitleWithPrefix } from "@lib/utils";

import useBlockchainTransactionStore from "@store/blockchainTransactionStore";
import { createResolutionFormStore } from "@store/resolutionFormStore";

import ResolutionForm from "@components/ResolutionForm";
import User from "@components/User";

import useResolutionCreate from "@hooks/useResolutionCreate";
import useResolutionTypes from "@hooks/useResolutionTypes";
import useResolutionsAcl from "@hooks/useResolutionsAcl";

import { useContractsContext } from "../contexts/ContractsContext";
import { MonthlyRewardsUserData } from "../types";
import Dialog from "./Dialog";

export default function NewResolution({
  executionPayload,
  monthlyRewardsResolutionData,
}: {
  executionPayload?: MonthlyRewardsUserData[] | null;
  monthlyRewardsResolutionData?: { title: string; content: string };
}) {
  const { types } = useResolutionTypes();
  const { acl } = useResolutionsAcl();
  const { onSubmit } = useResolutionCreate();
  const router = useRouter();
  const store = useRef(
    createResolutionFormStore(
      monthlyRewardsResolutionData ? { ...monthlyRewardsResolutionData, typeId: "routineVeto" } : {},
      !executionPayload,
    ),
  ).current;
  const { isAwaitingConfirmation, isLoading } = useBlockchainTransactionStore();
  const { reset, ...formProps } = useStore(store, (s) => s);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const { governanceTokenContractAddress } = useContractsContext();

  const disabledSubmit = !formProps.typeId || !acl?.canCreate || !formProps.title.trim() || !formProps.content.trim();
  const loadingSubmit = isAwaitingConfirmation || isLoading;

  const featureFlags = useFeatureFlags();
  const canCreateResolutions = featureFlags.canCreateResolutions().get(true);

  if (!canCreateResolutions) {
    <Alert severity="warning">
      Creating or updating resolutions is disabled at the moment. The functionality will be back shortly.
    </Alert>;
  }

  const handleSave = async () => {
    setConfirmDialogOpen(false);
    const vetoTypeId =
      formProps.typeId === "routineVeto" ? types.find((type) => type.name === "routine")?.id || null : null;
    const submittedSuccessfully = await onSubmit({
      vetoTypeId,
      currentResolution: {
        typeId: formProps.typeId,
        title: formProps.title,
        content: formProps.content,
        exclusionAddress: formProps.exclusionAddress,
      },
      executionData: executionPayload?.map((user) => user.executionData as string) || [],
      executionTo: executionPayload?.map(() => governanceTokenContractAddress as string) || [],
      ...(monthlyRewardsResolutionData && {
        metadata: {
          isMonthlyRewards: true,
          month: getPreviousMonth().toLowerCase(),
        },
      }),
    });

    if (submittedSuccessfully) {
      reset();
      router.push("/resolutions");
    }
  };

  const handlePreSave = async () => {
    setConfirmDialogOpen(true);
  };

  const handleCloseDialog = async () => {
    setConfirmDialogOpen(false);
  };

  return (
    <>
      <Head>
        <title>{enhanceTitleWithPrefix(`New Resolution: ${formProps.title}`)}</title>
      </Head>
      <Typography variant="h3">
        {formProps.title.trim() ? `Preliminary draft: ${formProps.title}` : "Preliminary draft Resolution"}
      </Typography>
      <ResolutionForm {...formProps} isMonthlyRewards={!!monthlyRewardsResolutionData} />
      {executionPayload && (
        <>
          <Dialog
            open={confirmDialogOpen}
            handleClose={handleCloseDialog}
            handleApprove={handleSave}
            descriptionId="dialog-approve-monthly"
            title="Heads up!"
          >
            <span>Are you sure the {getPreviousMonth()} rewards resolution hasn&apos;t been created yet?</span>
          </Dialog>
          <Box sx={{ p: 4, mb: 4, border: "1px solid gray", borderRadius: "4px" }}>
            <Typography sx={{ mb: 4 }} variant="h6">
              Execution Payload
            </Typography>
            <Alert severity="info" sx={{ mb: 4 }}>
              This payload will be used to automatically mint tokens for the contributors
            </Alert>
            {executionPayload
              .sort((a, b) => (a.tokens < b.tokens ? -1 : 1))
              .map((userData) => (
                <Box key={userData.address}>
                  <Typography variant="body2">
                    <b>
                      {userData.tokens} {TOKEN_SYMBOL}
                    </b>{" "}
                    to
                  </Typography>
                  <User address={userData.address} />
                  <Divider sx={{ mb: 1, pt: 1 }} />
                </Box>
              ))}
          </Box>
        </>
      )}
      <LoadingButton
        size="large"
        loading={loadingSubmit}
        variant="outlined"
        onClick={!!executionPayload ? handlePreSave : handleSave}
        disabled={disabledSubmit}
      >
        Create preliminary draft
      </LoadingButton>
    </>
  );
}
