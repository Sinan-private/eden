import {observer} from "mobx-react";
import {ResourceClass} from "@/Resource";
import styled from "styled-components";
import {Button} from "@/components/ui";

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
    <div className="flex justify-between gap-2 font-mono text-[12px] text-teal-200">
      <Button variant="ghost" onClick={onDecrement} className="min-w8 hover:bg-cyan-950">-</Button>
      <div>
        <p className="text-[10px]">{label}</p>
        <p>{beautifyValues ? beautify.value : value.toFixed(4)}</p>
      </div>
      <Button variant="ghost" onClick={onIncrement} className="min-w8 hover:bg-cyan-950">+</Button>
    </div>
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
  <div className="flex justify-between gap-2 font-mono text-[12px] text-teal-200">
    {onDecrement &&
      <Button variant="ghost" onClick={() => onDecrement()} className="min-w-8 hover:bg-cyan-950">-</Button>
    }
    <div style={{flexGrow: 1}}>
      <p className="text-[10px]">{label}</p>
      <p>{beautifyValues ? value.toFixed() : value.toFixed(4)}</p>
    </div>
    {onIncrement &&
      <Button variant="ghost" onClick={() => onIncrement()} className="min-w8 hover:bg-cyan-950">+</Button>
    }
  </div>
))