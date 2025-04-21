import {observer} from "mobx-react";
import {useMemo} from "react";
import {Input, Label, Switch} from "@/GameController/components/ui";
import {game} from "@/test_eden/Classes/Game";

export const EditResourceValue = observer(() => {
  const {getResourceForInput} = game().admin
  const {
    setValue,
    onInputMin,
    onInputMax,
    setMin,
    setMax,
    toggleUseMax,
    toggleUseMin,
    useMin,
    useMax,
    min,
    max,
    resource
  } = useMemo(getResourceForInput, [getResourceForInput])

  return (
    <>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label>Value</Label>
        <Input
          type="number"
          id="resource value"
          value={resource.value}
          onChange={setValue}
        />
      </div>
      <div className="flex w-full max-w-sm items-center gap-1.5">
        <div className="flex items-center space-x-2">
          <Switch id="use-max" checked={useMax} onCheckedChange={toggleUseMax}/>
          <Label htmlFor="use-max">use max value</Label>
        </div>
        <div>
          <Input
            disabled={!useMax}
            type={useMax ? "number" : "text"}
            id="resource max"
            value={max}
            onBlur={setMax}
            onChange={onInputMax}
          />
        </div>
      </div>
      <div className="flex w-full max-w-sm items-center gap-1.5">
        <div className="flex items-center space-x-2">
          <Switch id="use-min" checked={useMin} onCheckedChange={toggleUseMin}/>
          <Label htmlFor="use-min">use min value</Label>
        </div>
        <div>
          <Input
            disabled={!useMin}
            type={useMin ? "number" : "text"}
            id="resource min"
            value={min}
            onBlur={setMin}
            onChange={onInputMin}
          />
        </div>
      </div>
    </>
  )
})
