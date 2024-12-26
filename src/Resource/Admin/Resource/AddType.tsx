import {ChangeEvent, useState} from "react";
import {Stack, TextField} from "@mui/material";
import {useAdmin} from "../admin.context.ts";
import {ResourceTypes} from "../../ResourceHandler/specificTypes.ts";
import {resourceTypes} from "../../generated/resourceTypes.ts";

export const AddType = () => {
  const {write__addType} = useAdmin();
  const [input, setInput] = useState('');
  const onChange = (e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)
  const isError = resourceTypes.includes(input as ResourceTypes);
  const helperText = isError ? "Already exists" : "";
  const onSubmit = () => {
    write__addType(input).then(() => setInput(''))
  };
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <TextField
        type="text"
        label="New Type"
        error={isError}
        value={input}
        onChange={onChange}
        helperText={helperText}
      />
      <button onClick={onSubmit}>
        Save
      </button>
    </Stack>
  )
}
