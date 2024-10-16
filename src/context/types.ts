import {ResourceState, ResourceUpdateProps} from "../Resource";

import {ResourceKeys, ResourceTypes} from "../gameRules/types.ts";
// import {Resource} from "../gameRules/Resource.ts";

export type Update = ResourceUpdateProps<ResourceKeys, ResourceTypes>;
export type State = ResourceState<ResourceKeys, ResourceTypes>;
export type TradeUpdate = {
  give: (Update & {icon: string})[];
  gain: (Update & {icon: string})[];
  multiplier?: number
}
