import {
  AlertDialogAction,
  AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {ResourceCostUpdate} from "@/Resource/ResourceHandler/genericTypes.ts";
import {ResourceClass, ResourceKeys, ResourceTypes, TradeChange} from "@/Resource";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Switch} from "@/components/ui/switch.tsx";
import {useState} from "react";
import {Separator} from "@/components/ui/separator.tsx";
import {EditResourceProps, useAdmin} from "@/Resource/context/admin.context.ts";
import {resourceTypes} from "@/Resource/generated/resourceTypes.ts";
import {Image} from "@mynaui/icons-react";
import {Button} from "@/components/ui/button.tsx";
import {observer} from "mobx-react";

// Todo This is currently rendered for each single resource on opening the admin tool.
//  Instead it should be rendered individually

export const EditResource = observer(() => {
  // Can I just create a Resource here and use it with direct methods?
  const {editableResource: resource} = useAdmin()
  const [useMax, setUseMax] = useState(!!resource?.max && resource.max !== Infinity);
  const [useMin, setUseMin] = useState(!!resource?.min && resource.min !== -Infinity);
  const [type, setType] = useState(resource?.type)
  const onToggleMax = () => setUseMax(!useMax);
  const onToggleMin = () => setUseMin(!useMin);
  const onSetType = (type: string) => setType(type as ResourceTypes)
  const {icon, key} = (resource as ResourceClass);
  const {onCloseAlertDialog} = useAdmin();
  console.log(type, resource?.type)

  return (
    <AlertDialogContent className="overflow-y-auto max-h-full">
      <AlertDialogHeader className="flex-row justify-between items-center mb-2 space-y-0">
        <AlertDialogTitle>
          {resource?.label}
        </AlertDialogTitle>
        <Button variant="ghost">
          {icon && !icon.endsWith('empty.png')
            ? <img src={icon} alt={resource?.label} width={24} height={24} />
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
              value={resource.label}
              onChange={(e) => resource.setTo({label: e.target.value})}
              placeholder="Resource label"
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label>Key</Label>
            <Input
              type="text"
              id="resource key"
              value={resource.key}
              onChange={(e) => resource.setTo({key: e.target.value as ResourceKeys})}
              placeholder="Resource key (unique)"
            />
          </div>
          <div className="flex w-full max-w-sm items-center gap-1.5">
            <div>
              <Label>Type</Label>
              <Select value={type} onValueChange={onSetType}>
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
            <Input type="number" id="resource key" placeholder={String(resource?.value)}/>
          </div>
          <div className="flex w-full max-w-sm items-center gap-1.5">
            <div className="flex items-center space-x-2">
              <Switch id="use-max" checked={useMax} onCheckedChange={onToggleMax}/>
              <Label htmlFor="use-max">use max value</Label>
            </div>
            <div>
              <Input disabled={!useMax} type="number" id="resource max"
                     placeholder={resource?.max ? String(resource.max) : ''}/>
            </div>
          </div>
          <div className="flex w-full max-w-sm items-center gap-1.5">
            <div className="flex items-center space-x-2">
              <Switch id="use-min" checked={useMin} onCheckedChange={onToggleMin}/>
              <Label htmlFor="use-min">use min value</Label>
            </div>
            <div>
              <Input disabled={!useMin} type="number" id="resource min"
                     placeholder={resource?.min ? String(resource.min) : ''}/>
            </div>
          </div>

          <Separator className="my-4"/>

          <div>
            <p>Cost</p>
            <Cost trade={resource?.cost}/>
          </div>

        </div>
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCloseAlertDialog}>Cancel</AlertDialogCancel>
        <AlertDialogAction>Continue</AlertDialogAction>
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
  const {get} = useAdmin().resources;
  const resource = get(trade.key);
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