import Modal from "./Modal.tsx";
import {TextField} from "@mui/material";
import {useGame} from "../context/game.context.ts";
import {ChangeEvent, useState} from "react";
import {ResourceTypes} from "../gameRules/types.ts";

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
  const {types} = useGame().resources;
  const [input, setInput] = useState('');
  const onChange = (e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)
  const isError = types.includes(input as ResourceTypes);
  const helperText = isError ? "Already exists" : "";
  return (
    <Modal open={open} onClose={onClose}>
      <TextField
        type="text"
        label="New Type"
        error={isError}
        value={input}
        onChange={onChange}
        helperText={helperText}
      />
    </Modal>
  )
}