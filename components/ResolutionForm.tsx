import "easymde/dist/easymde.min.css";

import { useEffect, useRef, useState } from "react";

import {
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Switch,
  TextField,
} from "@mui/material";
import { Grid, Typography } from "@mui/material";

import { getPreviousMonth } from "@lib/resolutions/common";

import useResolutionTypes from "@hooks/useResolutionTypes";

import { RESOLUTION_TYPES_TEXTS } from "../i18n/resolution";
import User from "./User";
import UsersAutocomplete from "./UsersAutocomplete";

interface FormProps {
  isMonthlyRewards?: boolean;
  title: string;
  content: string;
  typeId: string;
  exclusionAddress: string;
  onUpdateTitle: (evt: any) => void;
  onUpdateType: (evt: any) => void;
  onUpdateContent: (content: string) => void;
  onUpdateExclusionAddress: (address: string) => void;
  isEditing?: boolean;
  addressedContributor?: string;
}

export default function ResolutionForm({
  isMonthlyRewards = false,
  title,
  content,
  typeId,
  exclusionAddress,
  onUpdateTitle,
  onUpdateType,
  onUpdateContent,
  onUpdateExclusionAddress,
  isEditing = false,
  addressedContributor,
}: FormProps) {
  const { types, isLoading: isLoadingTypes } = useResolutionTypes();
  const editorRef = useRef(null);

  const [withExclusion, setWithExclusion] = useState(exclusionAddress !== "");

  useEffect(() => {
    let easyMdeInstance: any = null;

    const initMdeInstance = async () => {
      const EasyMDE = (await import("easymde")).default;

      easyMdeInstance = new EasyMDE({
        element: editorRef?.current || undefined,
        spellChecker: false,
        minHeight: "350px",
        maxHeight: "350px",
        status: false,
        ...(isMonthlyRewards && { toolbar: false }),
      });

      easyMdeInstance.value(content || "");

      easyMdeInstance.codemirror.on("change", () => {
        onUpdateContent(easyMdeInstance.value());
      });

      if (isMonthlyRewards) {
        easyMdeInstance.codemirror.setOption("readOnly", true);
        EasyMDE.togglePreview(easyMdeInstance);
      }
    };

    initMdeInstance();

    return () => {
      easyMdeInstance?.cleanup();
      easyMdeInstance?.toTextArea();
    };
  }, [isMonthlyRewards]);

  const onChangeExclusion = () => {
    if (withExclusion) {
      onUpdateExclusionAddress("");
    }
    setWithExclusion((old) => !old);
  };

  return (
    <div>
      {isMonthlyRewards && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="warning">
            This resolution concerns the monthly token allocation and cannot be modified. Please read the text carefully
            and ensure that the token allocation resolution for <b>{getPreviousMonth()}</b> has not been created yet.
          </Alert>
        </Box>
      )}
      <TextField
        sx={{ mt: 2, mb: 2, width: { xs: "100%", md: "50%" } }}
        hiddenLabel
        variant="filled"
        placeholder="Resolution Title"
        value={title}
        onChange={onUpdateTitle}
        disabled={isMonthlyRewards}
      />
      <Box>
        <textarea ref={editorRef} />
      </Box>
      <Grid container sx={{ mb: 4, mt: 4 }}>
        <Grid item xs={12} lg={6}>
          <FormControl>
            <FormLabel id="radio-buttons-group-label">Resolution Type</FormLabel>
            {isLoadingTypes ? (
              <CircularProgress />
            ) : (
              <RadioGroup
                value={typeId}
                aria-labelledby="radio-buttons-group-label"
                name="radio-buttons-group"
                onChange={onUpdateType}
              >
                {types.map((resolutionType) => (
                  <FormControlLabel
                    value={resolutionType.id}
                    key={resolutionType.id}
                    control={<Radio disabled={isMonthlyRewards} />}
                    label={
                      <>
                        <Typography variant="h4">
                          {RESOLUTION_TYPES_TEXTS[resolutionType.name]?.title || resolutionType.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          dangerouslySetInnerHTML={{
                            __html:
                              RESOLUTION_TYPES_TEXTS[resolutionType.name]?.description ||
                              "** For testing purposes only **",
                          }}
                        />
                      </>
                    }
                  />
                ))}
              </RadioGroup>
            )}
          </FormControl>
        </Grid>
        {isEditing && addressedContributor && !/^0x0+$/.test(addressedContributor) && (
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Alert sx={{ mt: 4 }} severity="info">
              <AlertTitle>This contributor is excluded from voting</AlertTitle>
              <User address={addressedContributor} sx={{ pl: 1, mt: 1 }} />
            </Alert>
          </Grid>
        )}
        {!isEditing && (
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Paper sx={{ p: 4 }}>
              <FormControlLabel
                control={<Switch checked={withExclusion} onChange={onChangeExclusion} />}
                label="Resolution with exclusion"
              />
              {withExclusion && (
                <Box sx={{ mt: 4 }}>
                  <UsersAutocomplete
                    selectedAddress={exclusionAddress}
                    onChange={(address) => onUpdateExclusionAddress(address)}
                    label="Choose a contributor to exclude"
                  />
                </Box>
              )}
              <Alert severity="info" sx={{ mt: 4 }}>
                You can decide to exclude one contributor from the resolution. This contributor will not be able to vote
                on such resolution and their vote will not count.
              </Alert>
            </Paper>
          </Grid>
        )}
      </Grid>
    </div>
  );
}
