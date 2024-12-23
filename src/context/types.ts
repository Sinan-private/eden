
import {ResourceKeys, ResourceTypes} from "../Resource/specificTypes.ts";
import {ResourceState, ResourceUpdateProps} from "../Resource";

// import {EditResourceController} from "../gameRules/EditResourceController.ts";

export type Update = ResourceUpdateProps<ResourceKeys, ResourceTypes>;
export type State = ResourceState<ResourceKeys, ResourceTypes>;
export type TradeUpdate = {
  give: (Update & {icon: string})[];
  gain: (Update & {icon: string})[];
  multiplier?: number
}
