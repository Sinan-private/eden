import {State} from "../types.ts";
import {ResourceKeys} from "../../gameRules/types.ts";
import {Resource} from "../../gameRules/Resource.ts";
export type GetResource = (key: ResourceKeys) => Resource

export const get = (key: ResourceKeys, state: State[]): Resource => {
  const _this = state.find(resource => resource.key === key);
  if (!_this) throw new Error("Could not find resource key " + key);
  return new Resource(_this)
}
