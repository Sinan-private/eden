import {Resource} from "../../gameRules/Resource.ts";
import {ResourceState} from "../types.ts";

export const get = <K extends string, T extends string>(key: K, state: ResourceState<K, T>[]): Resource<K, T> => {
  const _this = state.find(resource => resource.key === key);
  if (!_this) throw new Error("Could not find resource key " + key);
  return new Resource<K, T>(_this)
}
