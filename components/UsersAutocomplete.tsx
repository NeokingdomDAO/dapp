import { useMemo } from "react";

import { Avatar, CircularProgress } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import { getLettersFromName } from "@lib/utils";

import useOdooUsers from "@hooks/useOdooUsers";

export default function UsersAutocomplete({
  onChange,
  selectedAddress,
  filterList,
  label,
}: {
  onChange: (address: string) => void;
  selectedAddress: string | null;
  filterList?: string[];
  label: string;
}) {
  const { allOdooUsers, isLoading } = useOdooUsers();

  const options = useMemo(() => {
    return allOdooUsers
      .filter((user) => !filterList || filterList.includes(user.ethereum_address))
      .map((user) => ({
        name: user.display_name,
        value: user.ethereum_address,
        image: user.image,
      }));
  }, [allOdooUsers]);

  if (isLoading) return <CircularProgress />;

  return (
    <Autocomplete
      id="users-autocomplete"
      sx={{ width: 300 }}
      options={options}
      autoHighlight
      value={options.find((opt) => opt.value === selectedAddress)}
      onChange={(_, option) => {
        onChange(option?.value || "");
      }}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Avatar
            sx={{ width: 32, height: 32, flexShrink: 0, mr: 2 }}
            alt={option?.name}
            src={`data:image/jpeg;charset=utf-8;base64,${option?.image || ""}`}
          >
            {getLettersFromName(option?.name)}
          </Avatar>
          {option.name}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-kek", // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}
