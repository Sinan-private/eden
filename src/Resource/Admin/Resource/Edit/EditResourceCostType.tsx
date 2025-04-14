import {AdminController} from "@/Resource/Admin/AdminController.ts";
import {ChangeEvent} from "react";
import {DeleteButton} from "@/components/ui/DeleteButton.tsx";
import {Input} from "@/components/ui/input.tsx";
import {ResourceKeys, ResourceTypes, TradeChange} from "@/Resource";
import {ResourceCostUpdate} from "@/Resource/ResourceHandler/genericTypes.ts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select.tsx";

type SingleTradeProps = {
  trade: ResourceCostUpdate<ResourceKeys, ResourceTypes>;
  type: keyof ResourceCostUpdate<ResourceKeys, ResourceTypes>
}
export const EditResourceCostType = ({trade, type}: SingleTradeProps) => {
  return (
    <div>
      <div className="flex items-center mb-2">
        <p className="text-xs font-bold uppercase mr-1">{type}</p>
      </div>
      {trade[type].map((singleTrade) => (
        <div key={singleTrade.key} className="rounded-md py-2 px-4 bg-zinc-900 mb-2">
          <SingleCost trade={singleTrade} type={type}/>
        </div>
      ))}
      <div className="rounded-md py-2 px-4 bg-zinc-900 mb-2">
        <AddCost type={type}/>
      </div>
    </div>
  )
}

const AddCost = ({type}: { type: SingleTradeProps['type'] }) => {
  const {editing, availableCostKeys} = AdminController.getInstance();
  const onSelect = (key: ResourceKeys) =>
    editing?.addCost(type, {key, value: 1})

  return (
    <div className="relative z-100 flex items-center">
      <p className="mr-2">
      Add
      </p>
      <div>
        <Select value={type} onValueChange={onSelect}>
          <SelectTrigger className="w-[140px] bg-black">
            <SelectValue placeholder="Select the type"/>
          </SelectTrigger>
          <SelectContent style={{zIndex: 6000}}>
            <SelectGroup>
              <SelectLabel>Types</SelectLabel>
              {availableCostKeys.map(resource => (
                <SelectItem key={resource.key} value={resource.key}>{resource.label}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}


type SingleCostProps = {
  trade: TradeChange;
  type: keyof ResourceCostUpdate<ResourceKeys, ResourceTypes>
}
const SingleCost = ({trade, type}: SingleCostProps) => {
  const {cloneResourceStore, editing} = AdminController.getInstance()
  const {getByKey} = cloneResourceStore
  const resource = getByKey(trade.key) || {};
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    editing!.updateCost(type, {key: trade.key, value: Number(e.target.value)})
  }
  const onRemoveCost = () => {
    editing!.removeCost(type, trade.key);
  }

  return (
    <div className="relative">
      <DeleteButton onClick={onRemoveCost} className="absolute" style={{top: -24, right: -24}}/>
      <p className="text-xs mb-1">
        {resource.label}
      </p>
      <div className="flex items-center space-x-2">
        <img src={resource.icon} alt={resource.label}/>
        <div className="w-20 max-w-sm">
          <Input
            id="resource cost edit"
            type="number"
            value={trade.value}
            onChange={onChange}
            className="bg-black"
          />
        </div>
      </div>
    </div>
  )
}
