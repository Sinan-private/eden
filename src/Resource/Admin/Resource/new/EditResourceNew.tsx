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
import {ResourceTypeRaw} from "@/Resource/ResourceHandler/genericTypes.ts";
import {ResourceKeys, ResourceTypes} from "@/Resource";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Switch} from "@/components/ui/switch.tsx";
import {useState} from "react";
import {Separator} from "@/components/ui/separator.tsx";
import {useAdmin} from "@/Resource/context/admin.context.ts";
import {resourceTypes} from "@/Resource/generated/resourceTypes.ts";

type EditResourceProps = {
  resource?: Partial<ResourceTypeRaw<ResourceKeys, ResourceTypes>>;
}

export const EditResource = ({resource}: EditResourceProps) => {
  const {getByType} = useAdmin().resources;
  const [useMax, setUseMax] = useState(!!resource?.max && resource.max !== Infinity);
  const [useMin, setUseMin] = useState(!!resource?.min && resource.min !== -Infinity);
  const [type, setType] = useState(resource?.type)
  const onToggleMax = () => setUseMax(!useMax);
  const onToggleMin = () => setUseMin(!useMin);
  return (
    <AlertDialogContent className="overflow-y-auto max-h-full">
      <AlertDialogHeader>
        <AlertDialogTitle className="mb-2">
          {resource?.label}
        </AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogDescription style={{display: 'none'}}>
        Edit resource
      </AlertDialogDescription>
      <div>
        <div className="flex flex-col gap-2">

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label>Name</Label>
            <Input type="text" id="resource name" placeholder={resource?.label}/>
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label>Key</Label>
            <Input type="text" id="resource key" placeholder={resource?.key}/>
          </div>
          <div className="flex w-full max-w-sm items-center gap-1.5">
            <div>
              <Label>Type</Label>
              <Select value={type} onValueChange={(value) => setType(value as ResourceTypes)}>
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


        </div>
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}