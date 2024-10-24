import {Stack, TextField} from "@mui/material";
import {useGame} from "../context/game.context.ts";
import {ChangeEvent, useState} from "react";
import {ResourceTypes} from "../Resource/types.ts";
import {resourceTypes} from "../Resource/generated/resourceTypes.ts";

export const AddType = () => {
  const {
    writeAddType
  } = useGame();
  const [input, setInput] = useState('');
  const onChange = (e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)
  const isError = resourceTypes.includes(input as ResourceTypes);
  const helperText = isError ? "Already exists" : "";
  const onSubmit = () => {
    writeAddType(input).then(() => setInput(''))
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
