import {ChangeEvent} from "react";
import {Stack, TextField} from "@mui/material";

export type EditAmountProps = {
  min: number;
  max: number;
  value: number;
  onSetMin(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
  onSetMax(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
  onSetValue(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
  onBlurMax(): void;
}

export const EditAmount = (
  {
    min,
    max,
    value,
    onSetMin,
    onSetMax,
    onSetValue,
    onBlurMax,
  }: EditAmountProps
) => (
  <Stack direction="row" alignItems="center">

    <TextField
      type="number"
      label="min"
      value={min}
      onChange={onSetMin}
      size="small"
      sx={{
        right: -1,
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        },
      }}
    />
    <TextField
      type="number"
      label="Initial"
      value={value}
      onChange={onSetValue}
    />
    <MaxInput
      value={max}
      onChange={onSetMax}
      onBlur={onBlurMax}

    />
  </Stack>
)

type MaxInputProps = {
  value: number;
  onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
  onBlur(): void;
}

const MaxInput = (
  {
    value,
    onChange,
    onBlur
  }: MaxInputProps) => {
  const isInfinity = value === Infinity;

  return (
    <TextField
      type={isInfinity ? "text" : "number"}
      label="Max"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      size="small"
      sx={{
        left: -1,
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        },
      }}
    />
  )
}
