import {ResourceSingle} from "../../Resource/ResourceSingle.ts";
import {State} from "../types.ts";
import {ResourceKeys, ResourceTypes} from "../../gameRules/types.ts";

export const get = (key: ResourceKeys, state: State[]): ResourceSingle<ResourceKeys, ResourceTypes> => {
  const _this = state.find(resource => resource.key === key);
  if (!_this) throw new Error("Could not find resource key " + key);
  return new ResourceSingle<ResourceKeys, ResourceTypes>(_this)
}
