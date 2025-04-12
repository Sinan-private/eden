import {useMemo} from "react";
import {observer} from "mobx-react";
import {useAdmin} from "@/Resource/context/admin2.context.ts";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Image} from "@mynaui/icons-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Switch} from "@/components/ui/switch.tsx";
import {resourceTypes} from "@/Resource/generated/resourceTypes.ts";
import {ResourceCostUpdate} from "@/Resource/ResourceHandler/genericTypes.ts";
import {ResourceKeys, ResourceTypes, TradeChange} from "@/Resource";

export const EditResource = observer(() => {
  const {
    // onSave,
    onResetEdit,
    editable,
  } = useAdmin()

  const {
    // keyAlreadyExists,
    getEditableResource,
  } = editable
  const {
    setLabel,
    setKey,
    setType,
    setValue,
    onInputMin,
    onInputMax,
    setMin,
    setMax,
    toggleUseMax,
    toggleUseMin,
    useMin,
    useMax,
    resource: {
      label,
      key,
      type,
      value,
      min,
      max,
      cost,
      icon,
    }
  } = getEditableResource()
  const onSave = () => {console.log('save')}
  const keyAlreadyExists = (key: any) => {
    // console.log('key', key)
    return true
  }

  const keyExists = useMemo(() => keyAlreadyExists(key), [key, keyAlreadyExists])

  const keyInput = useMemo(() => {
    if (keyExists) {
      return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label>Key</Label>
          <Input
            type="text"
            id="resource key"
            className="border-red-600 ring-red-600 focus-visible:ring-red-500"
            value={key}
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
          value={key}
          onChange={setKey}
          placeholder="Resource key (unique)"
        />
      </div>
    )
  }, [key, keyExists, setKey])

  return (
    <AlertDialogContent className="overflow-y-auto max-h-full">
      <AlertDialogHeader className="flex-row justify-between items-center mb-2 space-y-0">
        <AlertDialogTitle>
          {label}
        </AlertDialogTitle>
        <Button variant="ghost">
          {icon && !icon.endsWith('empty.png')
            ? <img src={icon} alt={label} width={24} height={24}/>
            : <Image/>
          }
        </Button>
      </AlertDialogHeader>
      <AlertDialogDescription style={{display: 'none'}}>
        Edit resource
      </AlertDialogDescription>
      <div>
        <div className="flex flex-col gap-2">

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label>Name</Label>
            <Input
              type="text"
              id="resource name"
              value={label}
              onChange={setLabel}
              placeholder="Resource label"
            />
          </div>
          {keyInput}
          <div className="flex w-full max-w-sm items-center gap-1.5">
            <div>
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
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

          <Separator className="my-4"/>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label>Value</Label>
            <Input
              type="number"
              id="resource value"
              value={value}
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

          <Separator className="my-4"/>

          <div>
            <p>Cost</p>
            <Cost trade={cost}/>
          </div>

        </div>
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onResetEdit}>Cancel</AlertDialogCancel>
        <AlertDialogAction disabled={keyExists} onClick={onSave}>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
})

const Cost = ({trade}: { trade?: ResourceCostUpdate<ResourceKeys, ResourceTypes> | null }) => {
  if (!trade) {
    return null
  }
  return (<SafeCost trade={trade}/>)
}

const SafeCost = ({trade}: { trade: ResourceCostUpdate<ResourceKeys, ResourceTypes> }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          {trade.give.map((trade) => (
            <SingleCost key={trade.key} trade={trade}/>
          ))}
        </div>
        <div>
          {trade.gain.map((trade) => (
            <SingleCost key={trade.key} trade={trade}/>
          ))}
        </div>
      </div>
    </>
  )
}

const SingleCost = ({trade}: { trade: TradeChange }) => {
  const {getByKey} = useAdmin().resources;
  const resource = getByKey(trade.key);
  return (
    <>
      <div className="flex items-center space-x-2">
        <div className="w-20 max-w-sm ">
          <Input type="number" id="resource cost edit" placeholder={String(trade.value)}/>
        </div>
        <img src={resource.icon} alt={resource.label}/>
        <p className="text-xs">
          {resource.label}
        </p>
      </div>
    </>
  )
}