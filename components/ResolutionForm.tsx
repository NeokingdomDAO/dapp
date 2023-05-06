import "easymde/dist/easymde.min.css";

import { useEffect, useRef } from "react";

import {
  Alert,
  Box,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { Grid, Typography } from "@mui/material";

import { getPreviousMonth } from "@lib/resolutions/common";

import useResolutionTypes from "@hooks/useResolutionTypes";

import { RESOLUTION_TYPES_TEXTS } from "../i18n/resolution";

interface FormProps {
  isMonthlyRewards?: boolean;
  title: string;
  content: string;
  typeId: string;
  onUpdateTitle: (evt: any) => void;
  onUpdateType: (evt: any) => void;
  onUpdateContent: (content: string) => void;
}

export default function ResolutionForm({
  isMonthlyRewards = false,
  title,
  content,
  typeId,
  onUpdateTitle,
  onUpdateType,
  onUpdateContent,
}: FormProps) {
  const { types, isLoading: isLoadingTypes } = useResolutionTypes();
  const editorRef = useRef(null);

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
      </Grid>
    </div>
  );
}
