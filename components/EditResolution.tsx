import Head from "next/head";
import { useRouter } from "next/router";
import { useStore } from "zustand";

import { useRef, useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import LoadingButton from "@mui/lab/LoadingButton";
import { Alert, Button, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";

import { useFeatureFlags } from "@lib/feature-flags/useFeatureFlags";
import { enhanceTitleWithPrefix } from "@lib/utils";

import useBlockchainTransactionStore from "@store/blockchainTransactionStore";
import { createResolutionFormStore } from "@store/resolutionFormStore";

import ResolutionForm from "@components/ResolutionForm";

import useResolutionApprove, { BLOCKCHAIN_TX_STATE_KEY } from "@hooks/useResolutionApprove";
import useResolutionReject from "@hooks/useResolutionReject";
import useResolutionTypes from "@hooks/useResolutionTypes";
import useResolutionUpdate from "@hooks/useResolutionUpdate";
import useResolutionsAcl from "@hooks/useResolutionsAcl";

import { ResolutionEntity } from "../types";
import Dialog from "./Dialog";

export default function EditResolution({ resolution }: { resolution: ResolutionEntity }) {
  const { types } = useResolutionTypes();
  const { acl } = useResolutionsAcl();
  const { onSubmit } = useResolutionUpdate();
  const { onSubmit: onSubmitApprove } = useResolutionApprove();
  const { onSubmit: onSubmitReject } = useResolutionReject();
  const featureFlags = useFeatureFlags();
  const canCreateResolutions = featureFlags.canCreateResolutions().get(false);
  const router = useRouter();
  const isVeto = resolution.resolutionType.name === "routine" && resolution.isNegative;
  const store = useRef(
    createResolutionFormStore({
      title: resolution?.title || "",
      content: resolution?.content || "",
      typeId: isVeto ? "routineVeto" : resolution?.resolutionType.id,
    }),
  ).current;
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const { reset, ...formProps } = useStore(store, (s) => s);

  const { isAwaitingConfirmation, isLoading, type } = useBlockchainTransactionStore();

  const disabledSubmit = !formProps.typeId || !acl?.canCreate || !formProps.title.trim() || !formProps.content.trim();
  const loadingSubmit = isAwaitingConfirmation || isLoading;

  const handleUpdate = async () => {
    const vetoTypeId =
      formProps.typeId === "routineVeto" ? types.find((type) => type.name === "routine")?.id || null : null;
    const submittedCorrectly = await onSubmit({
      resolutionId: resolution.id,
      vetoTypeId,
      currentResolution: {
        typeId: formProps.typeId,
        title: formProps.title,
        content: formProps.content,
      },
    });

    if (submittedCorrectly) {
      router.push("/resolutions");
    }
  };

  const handleCloseApproveDialog = () => {
    setApproveDialogOpen(false);
  };

  const handlePreApprove = () => {
    setApproveDialogOpen(true);
  };

  const handleApproveDialog = async () => {
    setApproveDialogOpen(false);
    const submittedCorrectly = await onSubmitApprove({ resolutionId: resolution.id });
    if (submittedCorrectly) {
      router.push("/resolutions");
    }
  };

  const handleCloseRejectDialog = () => {
    setRejectDialogOpen(false);
  };

  const handlePreReject = () => {
    setRejectDialogOpen(true);
  };

  const handleApproveRejectDialog = async () => {
    setRejectDialogOpen(false);
    const submittedCorrectly = await onSubmitReject({ resolutionId: resolution.id });
    if (submittedCorrectly) {
      router.push("/resolutions");
    }
  };

  if (!resolution) {
    return <Alert severity="warning">Resolution not found</Alert>;
  }

  const toUpdate =
    resolution.title !== formProps.title ||
    resolution.content !== formProps.content ||
    (isVeto ? formProps.typeId !== "routineVeto" : resolution.resolutionType.id !== formProps.typeId);

  if (!canCreateResolutions) {
    <Alert severity="warning">
      Creating or updating resolutions is disabled at the moment. The functionality will be back shortly.
    </Alert>;
  }

  return (
    <>
      <Head>
        <title>{enhanceTitleWithPrefix(`Edit Resolution: ${formProps.title}`)}</title>
      </Head>
      <Dialog
        open={approveDialogOpen}
        handleClose={handleCloseApproveDialog}
        handleApprove={handleApproveDialog}
        descriptionId="dialog-approve-resolution"
      >
        <span>Ensure the resolution is printed and digitally signed before approving.</span>
      </Dialog>
      <Dialog
        open={rejectDialogOpen}
        handleClose={handleCloseRejectDialog}
        handleApprove={handleApproveRejectDialog}
        descriptionId="dialog-reject-resolution"
      >
        <span>Rejecting the resolution will permanently remove the current draft. Proceed with caution.</span>
      </Dialog>
      <Typography variant="h3">
        {formProps.title.trim() ? `Preliminary Draft: ${formProps.title}` : "Preliminary Draft Resolution"}
      </Typography>
      <ResolutionForm
        {...formProps}
        isMonthlyRewards={(resolution.executionData || []).length > 0}
        isEditing
        addressedContributor={resolution?.addressedContributor}
      />
      <Box sx={{ pb: 4, pt: 4 }}>
        {toUpdate ? (
          <LoadingButton
            size="large"
            loading={loadingSubmit}
            variant="outlined"
            onClick={handleUpdate}
            disabled={disabledSubmit}
          >
            Update preliminary draft
          </LoadingButton>
        ) : (
          <Stack direction={{ md: "row" }} spacing={{ xs: 2 }} width="100%">
            <Button
              size="large"
              variant="outlined"
              startIcon={<PictureAsPdfIcon />}
              href={`/api/pdf/resolutions/${resolution.id}`}
              target="_blank"
            >
              Export to PDF
            </Button>
            <LoadingButton
              size="large"
              loading={loadingSubmit && type === BLOCKCHAIN_TX_STATE_KEY}
              variant="contained"
              onClick={handlePreApprove}
              disabled={disabledSubmit}
              loadingPosition="start"
              startIcon={<VerifiedUserIcon />}
            >
              Approve preliminary draft
            </LoadingButton>
            <LoadingButton
              size="large"
              loading={loadingSubmit && type !== BLOCKCHAIN_TX_STATE_KEY}
              variant="outlined"
              onClick={handlePreReject}
              disabled={disabledSubmit}
              color="error"
              loadingPosition="start"
              sx={{ marginLeft: { md: "auto !important" } }}
              startIcon={<DeleteIcon />}
            >
              Reject preliminary draft
            </LoadingButton>
          </Stack>
        )}
      </Box>
    </>
  );
}
