import {ResourceState} from "../types.ts";
import {ResourceBase} from "../ResourceBase.ts";
import {Resource} from "../Resource.ts";

export const get = <K extends string, T extends string>(key: K, state: ResourceState<K, T>[]): ResourceBase<K, T> => {
  const _this = state.find(resource => resource.key === key);
  if (!_this) throw new Error("Could not find resource key " + key);
  return new Resource<K, T>(_this, state)
}
