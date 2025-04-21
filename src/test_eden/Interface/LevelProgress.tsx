import {observer} from "mobx-react";
import {TradeChange} from "src/Game/Resource";
import {Progress} from "@/components/ui/progress.tsx";
import {game} from "@/test_eden/Classes/Game";

type LevelGainProps = {
  gain: TradeChange
}
export const LevelGain = ({gain}: LevelGainProps) => {
  const {getByKey} = game().resources;
  const {label, icon} = getByKey(gain.key)

  return (
    <div className="flex">

      <div className="relative p-1 mx-1">
        <img src={icon} alt={label}/>
        <p className="text-center absolute w-full" style={{bottom: 8, left: 0}}>{label}</p>
      </div>
      {gain.min &&
        <LevelGainDetail label="Value" value={gain.min}/>
      }
      {gain.max &&
        <LevelGainDetail label="Max" value={gain.max}/>
      }
      {gain.value &&
        <LevelGainDetail label="Value" value={gain.value}/>
      }
    </div>
  )
}
const LevelGainDetail = observer(({label, value}: { label: string; value: number }) => (
  <div className="justify-center mr-1 mt-1">
    <p className="text-center relative w-full" style={{top: 8}}>
      {label}
    </p>
    <span
      className="inline-flex items-center rounded-md bg-gray-800 px-2 py-1 text-xs font-medium text-gray-100 ring-1 ring-gray-500/10 ring-inset">
      {value}
    </span>
  </div>
))
type LevelProgressProps = {
  level: TradeChange;
  label?: string;
}
export const LevelProgress = (
  {
    level,
    label,
  }: LevelProgressProps) => {
  const {getByKey, percentageOf} = game().resources;
  const resource = getByKey(level.key);
  const percentage = percentageOf(Math.floor(resource.value), level.value!)
  return (
    <>
      <div className="flex justify-between">
        <p className="text-sm text-muted-foreground">{label || resource.label}</p>
        <p>{resource.beautify.value} / {level.value}</p>
      </div>
      <Progress
        value={percentage}
        // color={percentage < 100 ? "red" : "blue"}
      />
    </>
  )
}