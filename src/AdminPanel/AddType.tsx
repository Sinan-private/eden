import Modal from "./Modal.tsx";
import {Stack, TextField} from "@mui/material";
import {useGame} from "../context/game.context.ts";
import {ChangeEvent, useState} from "react";
import {ResourceTypes} from "../Resource/types.ts";

type AddTypeProps = {
  open: boolean;
  onClose(): void;
}

export const AddType = (
  {
    open,
    onClose
  }: AddTypeProps
) => {
  const {
    writeAddType,
    resources: {
    types
  }} = useGame();
  const [input, setInput] = useState('');
  const onChange = (e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)
  const isError = types.includes(input as ResourceTypes);
  const helperText = isError ? "Already exists" : "";
  const onSubmit = () => writeAddType(input);
  return (
    <Modal open={open} onClose={onClose}>
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
    </Modal>
  )
}