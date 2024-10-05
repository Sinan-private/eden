import {ResourceState, ResourceUpdateProps} from "../Resource/types.ts";

import {ResourceKeys, ResourceTypes} from "../gameRules/types.ts";

export type Update = ResourceUpdateProps<ResourceKeys, ResourceTypes>;
export type State = ResourceState<ResourceKeys, ResourceTypes>;
export type TradeUpdate = {
  give: Update[];
  gain: Update[];
  multiplier?: number
}
