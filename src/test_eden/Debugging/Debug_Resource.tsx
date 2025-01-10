import {observer} from "mobx-react";
import {ResourceClass} from "../../Resource";
import {Box, Button, Typography} from "@mui/material";
import styled from "styled-components";

export const Debug_ResourceGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`

type Debug_ResourceProps = {
  resource: ResourceClass;
  beautifyValues: boolean;
  incrementBy?: number;
  decrementBy?: number;
}

export const Debug_Resource = observer((
  {
    beautifyValues,
    incrementBy = 10,
    decrementBy = 10,
    resource:
      {
        beautify,
        label,
        value,
        updateValueBy
      }
  }: Debug_ResourceProps) => {
  const onIncrement = () => updateValueBy(incrementBy)
  const onDecrement = () => updateValueBy(-decrementBy)

  return (
    <Box display="flex" gap={2} justifyContent="space-between"
         sx={{fontFamily: 'monospace', fontSize: '12px', color: '#79ae79'}}>
      <Button onClick={onDecrement} sx={{minWidth: 30, color: 'white'}}>-</Button>
      <div>
        <Typography fontSize={10}>{label}</Typography>
        <Typography>{beautifyValues ? beautify.value : value.toFixed(4)}</Typography>
      </div>
      <Button onClick={onIncrement} sx={{minWidth: 30, color: 'white'}}>+</Button>
    </Box>
  )
})

type Debug_CustomResourceProps = {
  label: string;
  onIncrement?(): void;
  onDecrement?(): void;
  beautifyValues: boolean;
  value: number;
}

export const Debug_CustomResource = observer((
  {
    beautifyValues,
    label,
    value,
    onIncrement,
    onDecrement,
  }: Debug_CustomResourceProps) => (
  <Box display="flex" gap={2} justifyContent="space-between"
       sx={{fontFamily: 'monospace', fontSize: '12px', color: '#79ae79'}}>
    {onDecrement &&
      <Button onClick={() => onDecrement()} sx={{minWidth: 30}}>-</Button>
    }
    <div style={{flexGrow: 1}}>
      <Typography fontSize={10}>{label}</Typography>
      <Typography>{beautifyValues ? value.toFixed() : value.toFixed(4)}</Typography>
    </div>
    {onIncrement &&
      <Button onClick={() => onIncrement()} sx={{minWidth: 30}}>+</Button>
    }
  </Box>
))