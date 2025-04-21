import {useMemo} from "react";
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/GameController/components/ui";
import {resourceTypes} from "@/GameController/Resource/generated/resourceTypes.ts";
import {observer} from "mobx-react";
import {game} from "@/test_eden/Classes/Game";

export const EditResourceBase = observer(() => {
  const {keyAlreadyExists, getResourceForInput} = game().admin
  const {
    setLabel,
    setKey,
    setType,
    resource
  } = useMemo(getResourceForInput, [getResourceForInput])
  const keyExists = useMemo(() => keyAlreadyExists(resource.key), [resource.key, keyAlreadyExists])

  const keyInput = useMemo(() => {
    if (keyExists) {
      return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label>Key</Label>
          <Input
            type="text"
            id="resource key"
            className="border-red-600 ring-red-600 focus-visible:ring-red-500"
            value={resource.key}
            onChange={setKey}
            placeholder="Resource key (unique)"
          />
          <p className="text-xs text-red-500">Key already exists</p>
        </div>
      )
    }
    return (
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label>Key</Label>
        <Input
          type="text"
          id="resource key"
          value={resource.key}
          onChange={setKey}
          placeholder="Resource key (unique)"
        />
      </div>
    )
  }, [resource.key, keyExists, setKey])
  return (
    <>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label>Name</Label>
        <Input
          type="text"
          id="resource name"
          value={resource.label}
          onChange={setLabel}
          placeholder="Resource label"
        />
      </div>
      {keyInput}
      <div className="flex w-full max-w-sm items-center gap-1.5">
        <div>
          <Label>Type</Label>
          <Select value={resource.type} onValueChange={setType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select the type"/>
            </SelectTrigger>
            <SelectContent style={{zIndex: 6000}}>
              <SelectGroup>
                <SelectLabel>Types</SelectLabel>
                {resourceTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )
})