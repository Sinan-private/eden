import {ReactNode} from "react";
import {observer} from "mobx-react";
import {ResourceClass} from "@/GameController/Resource";
import {Button} from "@/GameController/components/ui";
import {Container} from "@/GameController/components/ui/Box.tsx";
import {game} from "@/Game/Classes/Game";

export const Debug_ResourceGroup = ({children}: {children: ReactNode}) => (
  <div className="flex flex-col gap-2">
    {children}
  </div>
)

type Debug_ResourceProps = {
  resource: ResourceClass;
  incrementBy?: number;
  decrementBy?: number;
}

export const Debug_Resource = observer((
  {
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
  const {showDebugPanelBeautifiedValues} = game().admin
  const onIncrement = () => updateValueBy(incrementBy)
  const onDecrement = () => updateValueBy(-decrementBy)

  return (
    <div className="flex justify-between gap-2 font-mono text-[12px] text-teal-200">
      <Button variant="ghost" onClick={onDecrement} className="min-w8 hover:bg-cyan-950">-</Button>
      <div>
        <p className="text-[10px]">{label}</p>
        <p>{showDebugPanelBeautifiedValues ? beautify.value : value.toFixed(4)}</p>
      </div>
      <Button variant="ghost" onClick={onIncrement} className="min-w8 hover:bg-cyan-950">+</Button>
    </div>
  )
})

type Debug_CustomResourceProps = {
  label: string;
  onIncrement?(): void;
  onDecrement?(): void;
  value: number;
}

export const Debug_CustomResource = observer((
  {
    label,
    value,
    onIncrement,
    onDecrement,
  }: Debug_CustomResourceProps) => {
  const {showDebugPanelBeautifiedValues} = game().admin
  return (
    <Container >
      {onDecrement &&
        <Button variant="ghost" onClick={() => onDecrement()} className="min-w-8 hover:bg-cyan-950">-</Button>
      }
      <div style={{flexGrow: 1}}>
        <p className="text-[10px]">{label}</p>
        <p>{showDebugPanelBeautifiedValues ? value.toFixed() : value.toFixed(4)}</p>
      </div>
      {onIncrement &&
        <Button variant="ghost" onClick={() => onIncrement()} className="min-w8 hover:bg-cyan-950">+</Button>
      }
    </Container>
  )
})
